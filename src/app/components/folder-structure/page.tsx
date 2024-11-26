"use client"
import { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
import dynamic from 'next/dynamic'
const FolderTree = dynamic(() => import('react-folder-tree'), { ssr: false });

interface ResponseDataGetRepo {
    status: number;
    data: FileData[] | string;
}

interface FileData {
    path: string;
    content: string;
}

interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'folder';
    content?: string;
    children?: FileNode[];
}

export default function FolderStructureViewer() {
    const [treeData, setTreeData] = useState<FileNode | null>(null);
    const [error, setError] = useState<string>('');
    const [selectedFileContent, setSelectedFileContent] = useState('');

    const fetchData = async () => {
        try {
            const response = await fetch('/api/get-repo');
            const data: FileNode = await response.json();

            if (response.ok) {
                console.log(data)
                setTreeData(data);
            } else {
                setError('An error occurred.');
            }
        } catch (err) {
            console.error('Fetch error:', err);
            setError('An error occurred while fetching data.');
        }
    };

    return (
        <main className='p-8 m-4 rounded-2xl border-2'>
                <div className='flex justify-center'>
                    <h2>Contents of 'repos' Directory:</h2>
                    <button onClick={fetchData}>Get Files</button>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>

                <div className='flex justify-between p-2 mt-4'>
                    <div className='w-1/2'>
                        {treeData && (
                            <FolderTree
                                indentPixels={0.5}
                                data={treeData}
                                showCheckbox={false}
                                onNameClick={({ defaultOnClick, nodeData }) => {
                                    defaultOnClick();
                                    if (nodeData.type === 'file') {
                                        setSelectedFileContent(nodeData.content);
                                    }
                                }}
                            />
                        )}
                    </div>
                    <div className='w-1/2'>
                        {selectedFileContent && (
                            <textarea
                                value={selectedFileContent}
                                onChange={(e) => setSelectedFileContent(e.target.value)}
                                className="w-full h-96 font-mono text-xs border boder-gray-300 rounded-md p-2.5 text-black"
                            />
                        )}
                    </div>
                </div>
        </main>
    );
}