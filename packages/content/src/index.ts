// Public surface of the shared content package.
// The typed data layer (projects / posts / services / pricing / process) plus the
// raw MDX reader. Consumed by both apps (apps/lgit, apps/rogue).
export * from './data';
export {
  getAllContent,
  getContentWithMDX,
  getContentFiles,
  parseContentFile,
  getContentDirectory,
} from './content';
export type { RawContentItem, ContentType } from './content';
