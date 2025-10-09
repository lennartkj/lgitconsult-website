import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';

// Import MDXRemoteProps ist nicht nötig und wurde entfernt.

// Define the props with the correct type for mdxSource.
// MDXRemoteSerializeResult ist der Typ, den die serialize-Funktion zurückgibt.
interface MdxContentProps {
    mdxSource: MDXRemoteSerializeResult;
}

export function MdxContent({ mdxSource }: MdxContentProps) {
    // Wenn Sie den {...mdxSource} Spread verwenden, ist dies der richtige Weg.
    return <MDXRemote {...mdxSource} />;
}
