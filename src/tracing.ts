import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';

const traceExporter = new OTLPTraceExporter({
  url: 'http://otel-collector:4318/v1/traces',
});


const metricExporter = new OTLPMetricExporter({
  url: 'http://otel-collector:4318/v1/metrics',
});

const sdk = new NodeSDK({
  serviceName: 'user-crud-service',
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

try {
    sdk.start();
    console.log('✅ OpenTelemetry tracing initialized');
} catch (error) {
    console.error('❌ Error initializing OpenTelemetry:', error);
}
