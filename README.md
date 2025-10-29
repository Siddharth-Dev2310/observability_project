# Observability Project

## Description

This project aims to implement observability in applications using Prometheus for metrics collection and Grafana for visualization. It provides a robust framework for monitoring user-related metrics and enhancing application performance.

## Technologies Used

- **NestJS**: A progressive Node.js framework for building efficient and scalable server-side applications.
- **Prometheus**: A powerful monitoring and alerting toolkit designed for reliability and scalability.
- **Grafana**: An open-source platform for monitoring and observability, allowing for the visualization of metrics collected by Prometheus.
- **TypeORM**: An ORM for TypeScript and JavaScript that supports various databases.
- **prom-client**: A Prometheus client for Node.js to expose metrics.

## Installation

1. Clone the repository:
   
   ```bash
   git clone https://github.com/Siddharth-Dev2310/observability_project.git
   cd observability_project
   ```

2. Install dependencies:
   
   ```bash
   npm install
   ```

3. Set up Docker containers (if applicable):
   
   ```bash
   docker-compose up -d
   ```

## Usage

- Start the application:
   
   ```bash
   npm run start
   ```

- Access the application at `http://localhost:3000`.
- View metrics at `http://localhost:3000/metrics`.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
