# SRE Observability Report: Review Universities

## 1. Containerization (Step 1)
The application has been fully containerized using Docker and Docker Compose. For the bonus requirement, the stack is configured with `deploy` keys to be compatible with **Docker Swarm**.

### Architecture
- **Frontend**: React (Vite) served by Nginx.
- **Backend**: Spring Boot (Java 17) with Actuator + Micrometer.
- **Database**: PostgreSQL 15.
- **Cache**: Redis 7.
- **Observability Stack**:
    - **Prometheus**: Metrics collection and alerting.
    - **Grafana**: Real-time dashboards.
    - **Node Exporter**: Host-level metrics.

### Docker Swarm Deployment (Bonus)
To fulfill the bonus requirement, follow these steps to deploy using Docker Swarm:

1.  **Initialize Swarm**:
    ```bash
    docker swarm init
    ```
2.  **Deploy the Stack**:
    ```bash
    docker stack deploy -c docker-compose.yml review_stack
    ```
3.  **Verify Services**:
    ```bash
    docker service ls
    ```
    This will show the replicas for each service (Backend: 2, Frontend: 2 as configured).

---

## 2. Reliability Targets (Step 2)

### SLI (Service Level Indicators)
1.  **Availability SLI**: The percentage of successful HTTP requests (non-5xx) over the total number of requests.
    - *Metric*: `rate(http_server_requests_seconds_count{status!~"5.."}[5m]) / rate(http_server_requests_seconds_count[5m])`
2.  **Latency SLI**: The percentage of requests completed in less than 500ms.
    - *Metric*: `histogram_quantile(0.95, sum(rate(http_server_requests_seconds_bucket[5m])) by (le))`

### SLO (Service Level Objectives)
1.  **Availability SLO**: 99.5% of requests per month must be successful.
2.  **Latency SLO**: 95% of requests must have a latency < 500ms.

### Error Budget Calculation
- **Total time per month**: 30 days × 24 hours × 60 minutes = 43,200 minutes.
- **Allowed unavailability (0.5%)**: 0.005 × 43,200 = **216 minutes (3.6 hours)**.
- **Allowed slow requests**: For 1,000,000 requests, 5% (50,000) can be slower than 500ms.

---

## 3. Monitoring & Dashboards (Step 3)

### Golden Signals
The Grafana dashboard (accessible at `:3000`) monitors the Four Golden Signals:
1.  **Latency**: Time it takes to service a request.
2.  **Traffic**: Demand placed on the system (Requests per second).
3.  **Errors**: Rate of requests that fail.
4.  **Saturation**: How "full" your service is (CPU/Memory/Connection Pools).

---

## 4. Alerting & Validation (Step 4)

### Alert Rules
1.  **Warning: HostHighCpuLoad**: Triggers when CPU load > 80%.
2.  **Critical: BackendDown**: Triggers when Prometheus cannot scrape the backend service for 1 minute.

### Manual Validation
To trigger the `BackendDown` alert manually:
```bash
docker stop $(docker ps -q --filter name=backend)
```
This will cause the `up{job="backend"}` metric to become `0`, firing the alert in Prometheus after 1 minute.
