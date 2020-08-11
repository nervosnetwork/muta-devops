# muta monitor ha 部署
该文档用于说明 muta monitor 组件的高可用部署方式
- Grafana
- Promethues
- Loki
- jaeger

## Grafana
[How to setup Grafana for high availability](https://grafana.com/docs/grafana/latest/tutorials/ha_setup/)


## Promethues
Promethues 的高可用主要通过以下两个方面解决
- [联邦集群](https://prometheus.io/docs/prometheus/latest/federation/)
- [远程存储](https://prometheus.io/docs/prometheus/latest/storage/)

### 组件列表
| 组件名 | 参考链接 | 说明 |
| --- | --- | --- |
| influxdb | [influxdb home](https://docs.influxdata.com/influxdb/v1.8/administration/config/) | 存储的组件，可根据官方文档替换 | 
| prometheus | [prometheus home](https://prometheus.io/docs/prometheus/latest/federation/ ) | - |
| remote-storage-adapter | [remote-storage-adapter git](https://github.com/prometheus/prometheus/blob/master/documentation/examples/remote_storage/remote_storage_adapter/README.md) | 处理 remote storage 的组件 |

### 逻辑结构
![](./asset/ha-promethues.png)

