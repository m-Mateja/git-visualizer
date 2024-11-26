"use client"
import {useEffect, useState} from 'react';
import {Dispatcher} from "undici-types";
import ResponseData = Dispatcher.ResponseData;
import FolderStructureViewer from "@/app/components/folder-structure/page";

interface ResponseDataCloneRepo{
    success: boolean
    status: number
    data?: string
    error?: string
}

export default function Home() {
    const [repoUrl, setRepoUrl] = useState('');
    const [fileTree, setFileTree] = useState<FileNode | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError('');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    const handleCloneRepo = async () => {
        setLoading(true);
        setError('');
        setFileTree(null);

        try {
            const response = await fetch('/api/clone-repo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoUrl }),
            });

            const data:ResponseDataCloneRepo = await response.json();

            if (data.status == 200) {
                // setFileTree(data.data);
                console.log('good')
            } else {
                setError( 'An error occurred.');
            }
        } catch {
            setError('An error occurred while cloning the repository.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <h1 className='p-8 text-center text-4xl'>Git Visualizer</h1>
            <div className='flex justify-center'>
                <input
                    className='m-4 p-2 w-1/4 rounded-2xl text-black'
                    type="text"
                    placeholder="Enter GitHub repository URL"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}/>
                <button
                    className='m-4 p-2 w-1/16 bg-purple-500 rounded-2xl'
                    onClick={handleCloneRepo}
                    disabled={loading}>
                    {loading ? 'Cloning...' : 'Clone Repository'}
                </button>
            </div>
            <div className='flex justify-center'>
                <p className='text-red-600'>{error}</p>
            </div>
            <div>
                <FolderStructureViewer></FolderStructureViewer>
            </div>
        </main>
    );
}

type FileNode = {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileNode[];
};