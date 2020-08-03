
# muta monitor 部署

## 工程目录结构
```
muta-monitor
|
|___ agent
|    |___ docker-compose.yml
|    |___ config
|          |___ promtail
|               |___ promtail-config.yaml
|
|___ monitor
     |___ docker-compose.yml
     |___ config
          |___ grafana
          |    |___ dashboards
          |    |    |___ muta-benchmark.json
          |    |    |___ muta-node.json
          |    |
          |    |___ provisioning
          |          |___ dashboards
          |          |    |___ dashboards.yaml
          |          |
          |          |___ datasources
          |               |___ datasources.yaml                            
          |___ loki
          |    |___ loki-local-config.yaml
          |
          |___ promethues
               |___ prometheus.yml


```

其中 agent 主要跟随 muta 部署，负责采集信息
monitor 需要一台机器部署，主要运行目前的监控服务


## Agent 详解
主要 agent 如下:

| agent | 功能 |
| --- | --- |
| aode-exporter | 采集机器信息(cpu, 内存等) |
| jaeger-agent | tracing |
| promtail-agent | 采集日志 |

### agent 目录
```
|___ agent
     |___ docker-compose.yml
     |___ config
           |___ promtail
                |___ promtail-config.yaml
 
```


### docker-compose.yml
```yml
version: '3'
services:
  node-exporter:
    image: quay.io/prometheus/node-exporter:v0.18.1
    container_name: muta_node_exporter
    command:
      - '--path.rootfs=/host'
      - '--collector.tcpstat'
    restart: on-failure
    network_mode: 'host'
    pid: 'host'
    volumes:
      - /:/host:ro,rslave

  jaeger-agent:
    image: jaegertracing/jaeger-agent:1.18.1
    container_name: muta_jaeger_agent
    command:
        # 这里将 jaeger-collector_ip 改成 jaeger-collector 部署节点的 ip 
      - '--reporter.grpc.host-port=jaeger-collector_ip:14250'
    ports:
      - '14271:14271'
      - '5775:5775/udp'
      - '6831:6831/udp'
      - '6832:6832/udp'
      - '5778:5778'
    restart: on-failure

  promtail:
    image: grafana/promtail:master-9ad98df
    container_name: muta_promtail
    restart: on-failure
    volumes:
      - ./data/promtail/positions:/tmp/promtail/
      - ./config/promtail/promtail-config.yaml:/etc/promtail/promtail-config.yaml
      # 这边挂载到 muta 打日志的目录
      - ./logs/promtail:/var/logs
    command: 
      -config.file=/etc/promtail/promtail-config.yaml


```
**一定挂载到 muta 打日志的目录**



### config 目录
该目录主要存放 Agent 的配置，目前测试环境的版本比较简单，只需要配置 promtail 的配置文件即可
```yml
server:
  http_listen_port: 9080
  grpc_listen_port: 0

positions:
  # 游标记录上一次同步位置
  filename: /tmp/promtail/positions.yaml   
  # 10秒钟同步一次
  sync_period: 10s 

clients:
  # Loki 的 server 地址，这边 ip 为 server_ip, port 对应 server docker-compose 暴露的端口， 默认3100
  - url: http://loki-server:3100/api/prom/push

scrape_configs:
  - job_name: test-log
    entry_parser: raw
    static_configs:
      - targets:
          - localhost
        # 设置采集的 label，后续检索日志会用到，  
        labels:
          job: muta
          app: muta
          # 这里改成宿主机的 ip 方便日志查询用
          hostip: host.docker.internal
          __path__: /var/logs/*log
```

## Monitor 详解
目前 muta 测试环境使用 docker-compose 的方式部署 monitor
主要服务如下:

| 服务名 | 功能 |
| --- | --- |
| Grafana | dashboard，监控，日志查看，告警配置 |
| Promethues | metric 存储 |
| Loki | 日志存储 |
| Jaeger | tracing 存储 |

### monitor 目录
```
|___ monitor
     |___ docker-compose.yml
     |___ config
          |___ grafana
          |    |___ dashboards
          |    |    |___ muta-benchmark.json
          |    |    |___ muta-node.json
          |    |
          |    |___ provisioning
          |          |___ dashboards
          |          |    |___ dashboards.yaml
          |          |
          |          |___ datasources
          |               |___ datasources.yaml                            
          |___ loki
          |    |___ loki-local-config.yaml
          |
          |___ promethues
               |___ prometheus.yml
```
### docker-compose.yml
```yml
version: "3"

services:

  # ================================= Grafana  ================================= 
  grafana:
    image: grafana/grafana:master
    container_name: muta-granafa
    restart: on-failure
    ports:
      - "3000:3000"
    volumes:
      - "./config/grafana/dashboards:/var/lib/grafana/dashboards"
      - "./config/grafana/provisioning:/etc/grafana/provisioning"
      - "./data/grafana/log:/var/log/grafana"
    environment:
      GF_EXPLORE_ENABLED: "true"
    networks:
      - muta-monitor     

  # ================================= Prometheus ================================= 
  prometheus:
    image: prom/prometheus
    container_name: muta-prometheus
    hostname: prometheus
    restart: on-failure
    volumes:
      - ./config/promethues/prometheus.yml:/etc/prometheus/prometheus.yml
      - ./data/prometheus:/prometheus
    ports:
      - "9090:9090"
    command:
      - --config.file=/etc/prometheus/prometheus.yml
      - --storage.tsdb.path=/prometheus
      - --web.console.libraries=/usr/share/prometheus/console_libraries
      - --web.console.templates=/usr/share/prometheus/consoles
      - --web.enable-lifecycle
    networks:
      - muta-monitor   

  # ================================= Jaeger  ================================= 
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.6.2
    container_name: muta-elasticsearch
    ports:
      - "9200:9200"
      - "9300:9300"
    restart: on-failure
    environment:
      - cluster.name=jaeger-cluster
      - discovery.type=single-node
      - http.host=0.0.0.0
      - transport.host=127.0.0.1
      - ES_JAVA_OPTS=-Xms8192m -Xmx8192m
      - xpack.security.enabled=false
    volumes:
      - ./data/elasticsearch/data:/usr/share/elasticsearch/data
    networks:
      - muta-monitor   

  jaeger-collector:
    image: jaegertracing/jaeger-collector:1.18.1
    container_name: muta-jaeger-collector
    ports:
      - "14269:14269"
      - "14268:14268"
      - "14250:14250"
      - "9411:9411"
    restart: on-failure
    environment:
      - SPAN_STORAGE_TYPE=elasticsearch
    command: [
      "--es.server-urls=http://elasticsearch:9200",
      "--es.num-shards=1",
      "--es.num-replicas=0",
      "--log-level=error"
    ]
    depends_on:
      - elasticsearch
    networks:
      - muta-monitor   

  jaeger-query:
    image: jaegertracing/jaeger-query:1.18.1
    container_name: muta-jaeger-query
    environment:
      - SPAN_STORAGE_TYPE=elasticsearch
      - no_proxy=localhost
    ports:
      - "16686:16686"
      - "16687:16687"
    restart: on-failure
    command: [
      "--es.server-urls=http://elasticsearch:9200",
      "--span-storage.type=elasticsearch",
      "--log-level=debug"
    ]
    depends_on:
      - jaeger-collector  
    networks:
      - muta-monitor   

  # ================================= Loki  ================================= 
  loki:
    image: grafana/loki:1.5.0
    container_name: muta-loki
    restart: on-failure
    ports:
      - "3100:3100"
    volumes:
      - ./config/loki:/etc/loki
      - ./data/nginx:/var/log/nginx
    command: -config.file=/etc/loki/loki-local-config.yaml
    networks:
      - muta-monitor   
```

### config 目录
monitor 的 config 较多，以下按顺序描述每个目录的功能和文件内容
#### grafana
该目录主要存在两个子目录
1. dashboards 放置 dashboard 模板
2. provisioning 初始化数据源和指定初始化 dashboard 的配置

##### dashboards
###### muta-benchmark.json
模板文件太长，请查看对应目录
###### muta-node.json
模板文件太长，请查看对应目录

##### provisioning
###### dashboards
配置 dashboards.yaml
```yaml
## config file version
apiVersion: 1

providers:
- name: 'default'
  orgId: 1
  folder: ''
  type: file
  options:
    path: /var/lib/grafana/dashboards

```
###### datasources
datasources.yaml
```yaml

apiVersion: 1
datasources:
- name: Prometheus
  type: prometheus
  access: proxy
  url: http://prometheus:9090
  basicAuth: false
- name: Loki
  type: loki
  access: proxy
  url: http://muta-loki:3100
  basicAuth: false

```

#### loki
##### loki-local-config.yaml
该文件主要为 Loki 的运行配置
```yaml
auth_enabled: false

server:
  http_listen_port: 3100

ingester:
  lifecycler:
    address: 127.0.0.1
    ring:
      kvstore:
        store: inmemory
      replication_factor: 1
    final_sleep: 0s
  chunk_idle_period: 5m
  chunk_retain_period: 30s

schema_config:
  configs:
  - from: 2020-05-15
    store: boltdb
    object_store: filesystem
    schema: v11
    index:
      prefix: index_
      period: 168h

storage_config:
  boltdb:
    directory: /tmp/loki/index

  filesystem:
    directory: /tmp/loki/chunks

limits_config:
  enforce_metric_name: false
  reject_old_samples: true
  reject_old_samples_max_age: 168h
  ingestion_rate_mb: 30

```



#### promethues
##### prometheus.yml
该文件主要是 Promethues 的运行配置，里面 job 部分为拉取配置
```yaml
# my global config
global:
  scrape_interval:     5s # Set the scrape interval to every 15 seconds. Default is every 1 minute.
  evaluation_interval: 5s # Evaluate rules every 15 seconds. The default is every 1 minute.
  scrape_timeout:         5s
  # scrape_timeout is set to the global default (10s).

# Alertmanager configuration
alerting:
  alertmanagers:
  - static_configs:
    - targets:
      # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "node_down.yml"
  # - "simulator_alert_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: 'prometheus'
    static_configs:
    - targets: ['127.0.0.1:9090']

  # 配置为 muta-jaeger-collector 和  muta-jaeger-query 所在 ip，端口和例子如下
  - job_name: 'jaeger'
    static_configs:
    - targets: ['muta-jaeger-collector:14269','muta-jaeger-query:16687']

  # 这里配置所有 muta 节点， ['node_id_1:9100, 'node_ip_2:9100', 'node_ip_3:9100']
  - job_name: 'node_exporter'
    static_configs:
    - targets: [node_exporter_ip]
  
  # 这里配置所有 muta 节点， ['node_id_1:8000', 'node_ip_2:8000', 'node_ip_3:8000']
  - job_name: 'muta_exporter'
    static_configs:
    - targets: ['muta_exporter_ip']


```

## 运行
参照 docker-compose 命令即可

### 地址
grafana
```http
http://grafana_ip:3000
```

jaeger 地址
```http
http://jarger_ip:16686
```
