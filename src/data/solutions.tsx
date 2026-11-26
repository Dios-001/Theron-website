import { HardHat, ListChecks, PawPrint, TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import type { SceneKind } from '../components/visuals/scenes'

export interface Solution {
  id: string
  title: string
  description: string
  features: string[]
  scene: SceneKind
  icon: ReactNode
  /** Dashboard view and category the "Learn More" link opens. */
  target: { view: string; category?: string }
  tag: string
}

export const SOLUTIONS: Solution[] = [
  {
    id: 'animal',
    title: 'Animal Detection',
    description: 'Detect and identify animals in camera feeds to support wildlife monitoring, agricultural operations, livestock management, and animal intrusion alerts.',
    features: ['Real-time animal detection', 'Configurable detection zones', 'Animal movement monitoring', 'Event snapshots and alerts', 'Historical event review'],
    scene: 'animal',
    icon: <PawPrint size={20} aria-hidden="true" />,
    target: { view: 'animal' },
    tag: 'Cam 05 · North paddock',
  },
  {
    id: 'rules',
    title: 'Instruction and Rule Violation Detection',
    description: 'Monitor predefined operational rules and identify observable actions or conditions that may violate established site procedures. Theron detects events you configure; it does not interpret intent.',
    features: ['Configurable rule-based monitoring', 'Restricted-zone entry detection', 'Unauthorized access alerts', 'Unsafe activity detection', 'Event logging and review'],
    scene: 'zone',
    icon: <ListChecks size={20} aria-hidden="true" />,
    target: { view: 'rules' },
    tag: 'Cam 03 · Forklift lane',
  },
  {
    id: 'ppe',
    title: 'PPE Detection and Compliance',
    description: 'Automatically identify visible personal protective equipment and flag potential safety compliance issues.',
    features: ['Hard hat detection', 'Safety vest detection', 'Safety glasses detection where supported', 'Gloves and safety footwear detection where supported', 'Missing-PPE alerts', 'Compliance reports and historical trends'],
    scene: 'ppe',
    icon: <HardHat size={20} aria-hidden="true" />,
    target: { view: 'ppe' },
    tag: 'Cam 01 · Assembly line',
  },
  {
    id: 'safety',
    title: 'Safety Violation Detection',
    description: 'Identify predefined unsafe conditions and potentially hazardous activities to help safety teams respond faster.',
    features: ['Restricted-area intrusion', 'Unsafe proximity to designated equipment', 'Fall or abnormal posture detection where supported', 'Crowd and occupancy monitoring', 'Configurable alert thresholds', 'Incident timelines and evidence snapshots'],
    scene: 'safety',
    icon: <TriangleAlert size={20} aria-hidden="true" />,
    target: { view: 'events', category: 'safety' },
    tag: 'Cam 04 · Press bay',
  },
]

export const SOLUTION_OPTIONS = [
  'Animal Detection',
  'PPE Compliance',
  'Rule and Instruction Violation Detection',
  'Safety Violation Detection',
  'Multiple Solutions',
  'Other',
]

export const INDUSTRY_OPTIONS = [
  'Manufacturing and Factories',
  'Construction and Infrastructure',
  'Warehousing and Logistics',
  'Agriculture and Livestock',
  'Wildlife and Environmental Monitoring',
  'Industrial Facilities and Operations',
  'Other',
]
