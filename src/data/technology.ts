export type CapabilityStatus = 'core' | 'supported' | 'planned'

export const STATUS_META: Record<CapabilityStatus, { label: string; hint: string }> = {
  core: { label: 'Core', hint: 'Part of the platform today' },
  supported: { label: 'Where supported', hint: 'Depends on the camera, site or deployment' },
  planned: { label: 'Planned', hint: 'On the roadmap, not available yet' },
}

export interface Capability {
  title: string
  body: string
  status: CapabilityStatus
}

// NOTE: statuses are provisional. Confirm each one with the product team before launch.
export const CAPABILITIES: Capability[] = [
  { title: 'Object detection and classification', body: 'Finds and labels supported objects such as people, PPE, vehicles and animals.', status: 'core' },
  { title: 'Video stream processing', body: 'Reads live camera streams and processes frames continuously.', status: 'core' },
  { title: 'Configurable detection zones', body: 'Draw the areas that matter and decide what counts as an event in each.', status: 'core' },
  { title: 'Event and rule engines', body: 'Turns detections into events using rules you configure per site.', status: 'core' },
  { title: 'Real-time notifications', body: 'Alerts the right team when a configured event is detected.', status: 'core' },
  { title: 'Analytics and reporting', body: 'Event history, compliance trends and exportable reports for audits.', status: 'core' },
  { title: 'Edge and cloud deployment', body: 'Run processing close to the cameras or in the cloud, depending on your setup.', status: 'supported' },
  { title: 'CCTV and IP camera integration', body: 'Connect compatible CCTV and IP camera systems. Compatibility is confirmed per site.', status: 'supported' },
  { title: 'Multi-site rollups', body: 'Compare events and compliance across several sites in one view.', status: 'planned' },
]
