# monitor 指标说明

## muta-node
### Resource Overview 
<table>
<thead>
  <tr>
    <th colspan="6">Resource Overview </th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>类型</td>
    <td>panel</td>
    <td>legend</td>
    <td>promQL</td>
    <td>说明</td>
    <td>预警说明</td>
  </tr>
  <tr>
    <td rowspan="3">cpu</td>
    <td rowspan="3">Overall total 5m load &amp; average CPU used</td>
    <td>CPU Cores</td>
    <td>count(node_cpu_seconds_total{job=~"$job", mode='system'})</td>
    <td>总计 core 数</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Total 5m load</td>
    <td>sum(node_load5{job=~"$job"})</td>
    <td>总计 cpu 5分钟负载</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Overall average used%</td>
    <td>avg(1 - avg(irate(node_cpu_seconds_total{job=~"$job",mode="idle"}[5m])) by (instance)) * 100</td>
    <td>总计 cpu 5分钟使用率</td>
    <td>阈值超过 60% 预警</td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td>/</td>
    <td>sum(node_load5{job=~"node_exporter"}) / count(node_cpu_seconds_total{job=~"node_exporter", mode='system'})</td>
    <td>load 和 核心数的比例</td>
    <td>阈值超过70% 预警</td>
  </tr>
  <tr>
    <td rowspan="3">memory</td>
    <td rowspan="3">Overall total memory &amp; average memory used</td>
    <td>Total</td>
    <td>sum(node_memory_MemTotal_bytes{job=~"$job"})</td>
    <td>总计内存大小</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Total Used</td>
    <td>sum(node_memory_MemTotal_bytes{job=~"$job"} - node_memory_MemAvailable_bytes{job=~"$job"})</td>
    <td>总计内存已使用大小</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Overall Average Used%</td>
    <td>(sum(node_memory_MemTotal_bytes{job=~"$job"} - node_memory_MemAvailable_bytes{job=~"$job"}) / sum(node_memory_MemTotal_bytes{job=~"$job"}))*100</td>
    <td>总计内存已使用率</td>
    <td>阈值超过70% 预警</td>
  </tr>
  <tr>
    <td rowspan="3">disk</td>
    <td rowspan="3">Overall total disk &amp; average disk used%</td>
    <td>Total</td>
    <td>sum(avg(node_filesystem_size_bytes{job=~"$job",fstype=~"xfs|ext.*"})by(device,instance))</td>
    <td>总计磁盘大小</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Total Used</td>
    <td>sum(avg(node_filesystem_size_bytes{job=~"$job",fstype=~"xfs|ext.*"})by(device,instance)) - sum(avg(node_filesystem_free_bytes{job=~"$job",fstype=~"xfs|ext.*"})by(device,instance))</td>
    <td>总计磁盘已使用大小</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Overall Average Used%</td>
    <td>(sum(avg(node_filesystem_size_bytes{job=~"$job",fstype=~"xfs|ext.*"})by(device,instance)) - sum(avg(node_filesystem_free_bytes{job=~"$job",fstype=~"xfs|ext.*"})by(device,instance))) *100/(sum(avg(node_filesystem_avail_bytes{job=~"$job",fstype=~"xfs|ext.*"})by(device,instance))+(sum(avg(node_filesystem_size_bytes{job=~"$job",fstype=~"xfs|ext.*"})by(device,instance)) - sum(avg(node_filesystem_free_bytes{job=~"$job",fstype=~"xfs|ext.*"})by(device,instance))))</td>
    <td>总计磁盘已使用率</td>
    <td>阈值超过70% 预警</td>
  </tr>
</tbody>
</table>


### Resource Details
<table>
<thead>
  <tr>
    <th colspan="6">Resource Details</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>类型</td>
    <td>panel</td>
    <td>legend</td>
    <td>promQL</td>
    <td>说明</td>
    <td>预警说明</td>
  </tr>
  <tr>
    <td rowspan="2">network</td>
    <td rowspan="2">Internet traffic per hour </td>
    <td>receive</td>
    <td>increase(node_network_receive_bytes_total{instance=~"$node",device=~"$device"}[60m])</td>
    <td>一小时下载流量统计</td>
    <td></td>
  </tr>
  <tr>
    <td>transmit</td>
    <td>increase(node_network_transmit_bytes_total{instance=~"$node",device=~"$device"}[60m])</td>
    <td>一小时上传带宽统计</td>
    <td></td>
  </tr>
  <tr>
    <td rowspan="5">cpu</td>
    <td rowspan="5">CPU% Basic</td>
    <td>System</td>
    <td>avg(irate(node_cpu_seconds_total{instance=~"$node",mode="system"}[5m])) by (instance) *100</td>
    <td>平均sy占用时间</td>
    <td>目前系统处于极低值，建议观察后设置</td>
  </tr>
  <tr>
    <td>User</td>
    <td>avg(irate(node_cpu_seconds_total{instance=~"$node",mode="user"}[5m])) by (instance) *100</td>
    <td>平均us占用时间</td>
    <td></td>
  </tr>
  <tr>
    <td>Iowait</td>
    <td>avg(irate(node_cpu_seconds_total{instance=~"$node",mode="iowait"}[5m])) by (instance) *100</td>
    <td>平均wa占用时间</td>
    <td>目前系统处于极低值，建议观察后设置</td>
  </tr>
  <tr>
    <td>Total</td>
    <td>(1 - avg(irate(node_cpu_seconds_total{instance=~"$node",mode="idle"}[5m])) by (instance))*100</td>
    <td>平均使用率</td>
    <td></td>
  </tr>
  <tr>
    <td>Average used%</td>
    <td>(1 - avg(irate(node_cpu_seconds_total{mode="idle"}[5m])) by (instance)) *100</td>
    <td>平均使用率，该指标用于预警，不展示</td>
    <td>阈值超过 60% 预警</td>
  </tr>
  <tr>
    <td rowspan="5">menory</td>
    <td rowspan="5">Memory Basic</td>
    <td>Total</td>
    <td>node_memory_MemTotal_bytes{instance=~"$node"}</td>
    <td>内存大小</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Used</td>
    <td>node_memory_MemTotal_bytes{instance=~"$node"} - node_memory_MemAvailable_bytes{instance=~"$node"}</td>
    <td>内存已使用大小</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Avaliable</td>
    <td>node_memory_MemAvailable_bytes{instance=~"$node"}</td>
    <td>内存可用大小</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Used%</td>
    <td>(1 - (node_memory_MemAvailable_bytes{instance=~"$node"} / (node_memory_MemTotal_bytes{instance=~"$node"})))* 100</td>
    <td>内存已使用率</td>
    <td>/</td>
  </tr>
  <tr>
    <td>{{instance}}-Used%</td>
    <td>(1 - (node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes))* 100</td>
    <td>内存已使用率，该指标用于预警，不展示</td>
    <td>阈值超过70% 预警</td>
  </tr>
  <tr>
    <td rowspan="2">network</td>
    <td rowspan="2">Network bandwidth usage per second all</td>
    <td>receive</td>
    <td>irate(node_network_receive_bytes_total{instance=~'$node',device=~"$device"}[5m])*8</td>
    <td>每秒下载流量统计</td>
    <td></td>
  </tr>
  <tr>
    <td>transmit</td>
    <td>irate(node_network_transmit_bytes_total{instance=~'$node',device=~"$device"}[5m])*8</td>
    <td>每秒上传带宽统计</td>
    <td></td>
  </tr>
  <tr>
    <td rowspan="6">cpu</td>
    <td rowspan="6">System Load</td>
    <td>1m</td>
    <td>node_load1{instance=~"$node"}</td>
    <td>1分钟负载</td>
    <td>/</td>
  </tr>
  <tr>
    <td>5m</td>
    <td>node_load5{instance=~"$node"}</td>
    <td>5分钟负载</td>
    <td>/</td>
  </tr>
  <tr>
    <td>15m</td>
    <td>node_load15{instance=~"$node"}</td>
    <td>15分钟负载</td>
    <td>/</td>
  </tr>
  <tr>
    <td>CPU cores</td>
    <td> sum(count(node_cpu_seconds_total{instance=~"$node", mode='system'}) by (cpu,instance)) by(instance)</td>
    <td>core 数</td>
    <td>/</td>
  </tr>
  <tr>
    <td>Load5 Avg</td>
    <td>avg(node_load5{instance=~"$node"}) / count(node_cpu_seconds_total{instance=~"$node", mode='system'})</td>
    <td>load5 平均负载使用率 </td>
    <td>/</td>
  </tr>
  <tr>
    <td>Load5 Avg-{{instance}}</td>
    <td>sum(node_load5) by (instance) / count(node_cpu_seconds_total{job=~"node_exporter", mode='system'}) by (instance)</td>
    <td>load5 平均负载使用率, 该指标用于预警，不展示 </td>
    <td>阈值超过70% 预警</td>
  </tr>
  <tr>
    <td rowspan="9">disk</td>
    <td rowspan="2">Disk R/W Data</td>
    <td>Read bytes</td>
    <td>irate(node_disk_read_bytes_total{instance=~"$node"}[5m])</td>
    <td>5分钟内每秒读取 bytes 数</td>
    <td></td>
  </tr>
  <tr>
    <td>Written bytes</td>
    <td>irate(node_disk_written_bytes_total{instance=~"$node"}[5m])</td>
    <td>5分钟内每秒写入 bytes 数</td>
    <td></td>
  </tr>
  <tr>
    <td>Disk Space Used% Basic</td>
    <td>mountpoint</td>
    <td>(node_filesystem_size_bytes{instance=~'$node',fstype=~"ext.*|xfs",mountpoint !~".*pod.*"}-node_filesystem_free_bytes{instance=~'$node',fstype=~"ext.*|xfs",mountpoint !~".*pod.*"}) *100/(node_filesystem_avail_bytes {instance=~'$node',fstype=~"ext.*|xfs",mountpoint !~".*pod.*"}+(node_filesystem_size_bytes{instance=~'$node',fstype=~"ext.*|xfs",mountpoint !~".*pod.*"}-node_filesystem_free_bytes{instance=~'$node',fstype=~"ext.*|xfs",mountpoint !~".*pod.*"}))</td>
    <td></td>
    <td>阈值超过70% 预警</td>
  </tr>
  <tr>
    <td rowspan="2">Disk IOps Completed（IOPS）</td>
    <td>Reads completed</td>
    <td>irate(node_disk_reads_completed_total{instance=~"$node"}[5m])</td>
    <td>5分钟内每秒读取完成数</td>
    <td></td>
  </tr>
  <tr>
    <td>Writes completed</td>
    <td>irate(node_disk_writes_completed_total{instance=~"$node"}[5m])</td>
    <td>5分钟内每秒写入完成数</td>
    <td></td>
  </tr>
  <tr>
    <td rowspan="2">Time Spent Doing I/Os</td>
    <td>IO time</td>
    <td>irate(node_disk_io_time_seconds_total{instance=~"$node"}[5m])</td>
    <td>磁盘 io 使用率</td>
    <td></td>
  </tr>
  <tr>
    <td>{{instance}}-%util</td>
    <td>irate(node_disk_io_time_seconds_total{instance=~"(.*):9100"}[5m])</td>
    <td>磁盘 io 使用率, 该指标用于预警，不展示 </td>
    <td>系统目前 80%， 阈值建议80%</td>
  </tr>
  <tr>
    <td rowspan="2">Disk R/W Time(Reference: less than 100ms)(beta)</td>
    <td>Read time</td>
    <td>irate(node_disk_read_time_seconds_total{instance=~"$node"}[5m]) / irate(node_disk_reads_completed_total{instance=~"$node"}[5m])</td>
    <td>五分钟内每次读取完成耗时</td>
    <td></td>
  </tr>
  <tr>
    <td>Write time</td>
    <td>irate(node_disk_write_time_seconds_total{instance=~"$node"}[5m]) / irate(node_disk_writes_completed_total{instance=~"$node"}[5m])</td>
    <td>五分钟内每次写入完成耗时</td>
    <td></td>
  </tr>
  <tr>
    <td rowspan="10">network</td>
    <td rowspan="10">Network Sockstat</td>
    <td>CurrEstab</td>
    <td>node_netstat_Tcp_CurrEstab{instance=~'$node'}</td>
    <td>当前状态为 ESTABLISHED 的连接数</td>
    <td></td>
  </tr>
  <tr>
    <td>TCP_tw</td>
    <td>node_sockstat_TCP_tw{instance=~'$node'}</td>
    <td>等待关闭的TCP连接数</td>
    <td></td>
  </tr>
  <tr>
    <td>Sockets_used</td>
    <td>node_sockstat_sockets_used{instance=~'$node'}</td>
    <td>已使用的所有协议套接字总量</td>
    <td></td>
  </tr>
  <tr>
    <td>UDP_inuse</td>
    <td>node_sockstat_UDP_inuse{instance=~'$node'}</td>
    <td>正在使用的 UDP 套接字数量</td>
    <td></td>
  </tr>
  <tr>
    <td>TCP_alloc</td>
    <td>node_sockstat_TCP_alloc{instance=~'$node'}</td>
    <td>已分配（已建立、已申请到sk_buff）的TCP套接字数量</td>
    <td></td>
  </tr>
  <tr>
    <td>Tcp_PassiveOpens</td>
    <td>irate(node_netstat_Tcp_PassiveOpens{instance=~'$node'}[5m])</td>
    <td>已从 LISTEN 状态直接转换到 SYN-RCVD 状态的 TCP 平均连接数</td>
    <td></td>
  </tr>
  <tr>
    <td>Tcp_ActiveOpens</td>
    <td>irate(node_netstat_Tcp_ActiveOpens{instance=~'$node'}[5m])</td>
    <td>已从 CLOSED 状态直接转换到 SYN-SENT 状态的 TCP 平均连接数</td>
    <td></td>
  </tr>
  <tr>
    <td>Tcp_InSegs</td>
    <td>irate(node_netstat_Tcp_InSegs{instance=~'$node'}[5m])</td>
    <td>TCP 接收的目前所有建立连接的错误报文数</td>
    <td></td>
  </tr>
  <tr>
    <td>Tcp_OutSegs</td>
    <td>irate(node_netstat_Tcp_OutSegs{instance=~'$node'}[5m])</td>
    <td>TCP 发送的报文数</td>
    <td></td>
  </tr>
  <tr>
    <td>Tcp_RetransSegs</td>
    <td>irate(node_netstat_Tcp_RetransSegs{instance=~'$node'}[5m])</td>
    <td>TCP 重传报文数</td>
    <td></td>
  </tr>
  <tr>
    <td rowspan="2">disk</td>
    <td rowspan="2">Open  File Descriptor(left)/Context switches(right)</td>
    <td>used filefd</td>
    <td>node_filefd_allocated{instance=~"$node"}</td>
    <td>打开文件描述符数</td>
    <td></td>
  </tr>
  <tr>
    <td>switches</td>
    <td>irate(node_context_switches_total{instance=~"$node"}[5m])</td>
    <td>CPU 的 context switch 平均次数</td>
    <td></td>
  </tr>
</tbody>
</table>

### Actuator Health
<table>
<thead>
  <tr>
    <th colspan="6">Actuator Health<br></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>类型</td>
    <td>panel</td>
    <td>legend</td>
    <td>promQL</td>
    <td>说明</td>
    <td></td>
  </tr>
  <tr>
    <td rowspan="3">muta</td>
    <td rowspan="3">Muta Status</td>
    <td>active</td>
    <td>count(up{job="muta_exporter"} == 1) </td>
    <td>当前 up 状态的 muta 服务</td>
    <td></td>
  </tr>
  <tr>
    <td>down</td>
    <td>count(up{job="muta_exporter"} == 0) </td>
    <td>当前 down 状态的 muta 服务</td>
    <td></td>
  </tr>
  <tr>
    <td>/</td>
    <td>up{job="muta_exporter"} == 0</td>
    <td>不显示，主要用来做 down 警报</td>
    <td></td>
  </tr>
  <tr>
    <td rowspan="3">node</td>
    <td rowspan="3">Node Status</td>
    <td>active</td>
    <td>count(up{job="node_exporter"} == 1) </td>
    <td>当前 up 状态的 node-exporter 服务</td>
    <td></td>
  </tr>
  <tr>
    <td>down</td>
    <td>count(up{job="node_exporter"} == 0) </td>
    <td>当前 down 状态的 node-exporter 服务</td>
    <td></td>
  </tr>
  <tr>
    <td>/</td>
    <td>up{job="node_exporter"} == 0</td>
    <td>不显示，主要用来做 down 警报</td>
    <td></td>
  </tr>
  <tr>
    <td rowspan="3">promethues</td>
    <td rowspan="3">Promethues Status</td>
    <td>active</td>
    <td>count(up{job="prometheus"} == 1) </td>
    <td>当前 up 状态的 promethues 服务</td>
    <td></td>
  </tr>
  <tr>
    <td>down</td>
    <td>count(up{job="prometheus"} == 0) </td>
    <td>当前 down 状态的 promethues 服务</td>
    <td></td>
  </tr>
  <tr>
    <td>/</td>
    <td>up{job="prometheus"} == 0</td>
    <td>不显示，主要用来做 down 警报</td>
    <td></td>
  </tr>
  <tr>
    <td rowspan="2">promtail </td>
    <td rowspan="2">Promtail Status</td>
    <td>active</td>
    <td>count(count_over_time({job="muta"}[5m]))</td>
    <td>当前 up 状态的 promtail 服务</td>
    <td></td>
  </tr>
  <tr>
    <td>/</td>
    <td>count(count_over_time({job="muta"}[5m])) by (hostip)</td>
    <td>不显示，主要用来做 down 警报</td>
    <td></td>
  </tr>
  <tr>
    <td rowspan="6">jaeger</td>
    <td rowspan="6">Jaeger Status</td>
    <td>jaeger-query-active</td>
    <td>count(up{instance=~"(.*):16687"} == 1)</td>
    <td>当前 up 状态的 jaeger-query 服务</td>
    <td></td>
  </tr>
  <tr>
    <td>jaeger-collector-active</td>
    <td>count(up{instance=~"(.*):14269"} == 1)</td>
    <td>当前 up 状态的 jaeger-collector 服务</td>
    <td></td>
  </tr>
  <tr>
    <td>jaeger-query-down</td>
    <td>count(up{instance=~"(.*):16687"} == 0)</td>
    <td>当前 down 状态的 jaeger-query 服务</td>
    <td></td>
  </tr>
  <tr>
    <td>jaeger-collector-down</td>
    <td>count(up{instance=~"(.*):14269"} == 0)</td>
    <td>当前 down 状态的 jaeger-collector 服务</td>
    <td></td>
  </tr>
  <tr>
    <td>/</td>
    <td>up{instance=~"(.*):16687"} == 0</td>
    <td>不显示，主要用来做 jaeger-query down 警报</td>
    <td></td>
  </tr>
  <tr>
    <td>/</td>
    <td>up{instance=~"(.*):14269"} == 0</td>
    <td>不显示，主要用来做 jaeger-collector down 警报</td>
    <td></td>
  </tr>
</tbody>
</table>

## muta-benchmark
<table>
<thead>
  <tr>
    <th>panel</th>
    <th>legend</th>
    <th>promQL</th>
    <th>说明</th>
    <th>作用</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>TPS</td>
    <td>TPS</td>
    <td>avg(rate(muta_consensus_committed_tx_total[5m]))</td>
    <td>5分钟内每秒平均 TPS</td>
    <td>待补充</td>
  </tr>
  <tr>
    <td>consensus_p90</td>
    <td>time_usage(s)</td>
    <td>avg(histogram_quantile(0.90, sum(rate(muta_consensus_duration_seconds_bucket[5m])) by (le, instance)))</td>
    <td>5分钟内平均共识达成时间</td>
    <td>待补充</td>
  </tr>
  <tr>
    <td>exec_p90</td>
    <td>value</td>
    <td>avg(histogram_quantile(0.90, sum(rate(muta_consensus_time_cost_seconds_bucket{type="exec"}[5m])) by (le, instance)))</td>
    <td>5分钟内平均共识处理时间</td>
    <td>待补充</td>
  </tr>
  <tr>
    <td>put_cf_each_block_time_usage</td>
    <td>value</td>
    <td>avg (sum by (instance) (increase(muta_storage_put_cf_seconds[5m]))) / avg(increase(muta_consensus_height[5m]))</td>
    <td>5分钟内写入高度的平均时间</td>
    <td>待补充</td>
  </tr>
  <tr>
    <td>get_cf_each_block_time_usage</td>
    <td>value</td>
    <td>avg (sum by (instance) (increase(muta_storage_get_cf_seconds[5m]))) / avg(increase(muta_consensus_height[5m]))</td>
    <td>5分钟内读取高度的平均时间</td>
    <td>待补充</td>
  </tr>
  <tr>
    <td rowspan="3">processed_tx_request</td>
    <td>Total</td>
    <td>sum(rate(muta_api_request_result_total{type="send_transaction"}[5m]))</td>
    <td>5分钟内每秒发送的交易请求总数</td>
    <td>待补充</td>
  </tr>
  <tr>
    <td>Success Total</td>
    <td>sum(rate(muta_api_request_result_total{result="success",type="send_transaction"}[5m]))</td>
    <td>5分钟内每秒发送的交易请求 Success 总数 </td>
    <td>待补充</td>
  </tr>
  <tr>
    <td>instance</td>
    <td>rate(muta_api_request_result_total{result="success", type="send_transaction"}[5m])</td>
    <td>5分钟内每个节点每秒发送交易请求 Success 数</td>
    <td>待补充</td>
  </tr>
  <tr>
    <td>current_height</td>
    <td>instance</td>
    <td>sort_desc(muta_consensus_height)</td>
    <td>当前区块高度</td>
    <td>待补充</td>
  </tr>
  <tr>
    <td>synced_block</td>
    <td>instance</td>
    <td>muta_consensus_sync_block_total </td>
    <td>每个节点同步区块总数</td>
    <td>待补充</td>
  </tr>
  <tr>
    <td>network_message_arrival_rate</td>
    <td>value</td>
    <td>((sum(muta_network_message_total{target="all", direction="sent"}) * 20) +<br> (sum(muta_network_message_total{target="single", direction="sent"})) )<br>/<br>sum(muta_network_message_total{direction="received"}) <br></td>
    <td>5分钟内网络到达率</td>
    <td>待补充</td>
  </tr>
  <tr>
    <td>consensus_round_cost</td>
    <td>instance</td>
    <td>(muta_consensus_round &gt; 0 )</td>
    <td>达成共识需要的轮次（常规为 0， view change 时，数值会发生改变）</td>
    <td>待补充</td>
  </tr>
  <tr>
    <td>mempool_cached_tx</td>
    <td>instance</td>
    <td>muta_mempool_tx_count</td>
    <td>当期交易池中的交易数量</td>
    <td>待补充</td>
  </tr>
</tbody>
</table>