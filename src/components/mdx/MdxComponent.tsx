// src/components/mdx/MdxContent.tsx
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

// You can use a direct type for the prop itself
interface MdxContentProps {
    mdxSource: MDXRemoteSerializeResult;
}

export function MdxContent({ mdxSource }: MdxContentProps) {
    // Pass the entire serialized object as the prop
    // The MDXRemote component expects the serialized object directly
    return <MDXRemote {...mdxSource} />;
}