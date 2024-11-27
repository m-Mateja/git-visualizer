"use client"
import {useEffect, useState} from 'react';
import FolderStructureViewer from "@/app/components/folder-structure/page";

interface ResponseDataCloneRepo{
    success: boolean
    status: number
    data?: string
    error?: string
}

export default function Home() {
    const [repoUrl, setRepoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [gitCloneSuccess, setGitCloneSuccess] = useState<boolean>(false)
    const [error, setError] = useState('');

    /**
     * If there is an error, remove is after 2 seconds so the user can try again
     */
    useEffect(() => {
        if (error) {
            const timer: NodeJS.Timeout = setTimeout(() => {
                setError('');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [error]);

    /**
     * Once the git repo has been cloned, send a fetchData event to the listener in folder-structure
     * This triggers the folder structure, editor and save file button accessibility
     */
    useEffect(() => {
        if(gitCloneSuccess){
            const folderViewerElement: HTMLElement | null = document.getElementById('folder-structure-viewer')
            if(folderViewerElement){
                folderViewerElement.dispatchEvent(new CustomEvent('fetchData'))
            }
        }
    }, [gitCloneSuccess])

    /**
     * POST method to capture git repo and clone to local directory
     */
    const handleCloneRepo = async () => {
        setLoading(true);
        setError('');
        setGitCloneSuccess(false);

        try {
            const response: Response = await fetch('/api/clone-repo', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ repoUrl }),
            });

            const data:ResponseDataCloneRepo = await response.json();

            if (data.status == 200) {
                setGitCloneSuccess(true)
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
                    className='m-4 p-2 w-1/2 rounded-2xl text-black'
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
            <div id='folder-structure-viewer'>
                <FolderStructureViewer></FolderStructureViewer>
            </div>
        </main>
    );
}