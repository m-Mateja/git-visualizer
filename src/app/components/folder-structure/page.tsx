"use client"
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'
import {NodeData} from "react-folder-tree";
import {ResponseData} from "@/app/api/clone-repo/route";
const FolderTree = dynamic(() => import('react-folder-tree'), { ssr: false });

interface FileNode extends NodeData{
    path: string
    type: 'file' | 'folder'
    content?: string
}

export default function FolderStructureViewer() {
    const [treeData, setTreeData] = useState<FileNode | undefined>(undefined);
    const [error, setError] = useState<string | undefined>('');
    const [success, setSuccess] = useState<string | undefined>('')
    const [selectedFileContent, setSelectedFileContent] = useState<string>('');
    const [selectedFilePath, setSelectedFilePath] = useState<string>('')
    const [repoNotClonedYet, setRepoNotClonedYet] = useState<boolean>(true)

    /**
     * If there is an error or success, remove is after 3 seconds so the user can try again
     */
    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (error) {
            timer = setTimeout(() => {
                setError('')
            }, 3000)

        } else if (success) {
            timer = setTimeout(() => {
                setSuccess('')
            }, 3000)
        }
        return () => {clearTimeout(timer)
        }
    }, [error, success])

    /**
     * Set an event listener to fetch repo data when it has completed cloning from the main component
     */
    useEffect(() => {
        const folderViewerElement: HTMLElement | null = document.getElementById('folder-structure-viewer');
        if (folderViewerElement) {
            folderViewerElement.addEventListener('fetchData', fetchData);
        }
    }, [])

    /**
     * GET repo folders and files
     * Return tree which represents folders with children and files with no children
     * Set tree data, and set repoNotClonedYet flag to false so that the editor loads up
     */
    const fetchData = async (): Promise<void> => {
        setRepoNotClonedYet(true)
        setSelectedFileContent('')
        setSelectedFilePath('')

        const response: Response = await fetch('/api/get-repo');
        const data: ResponseData = await response.json();

        if (response.ok && typeof data.data !== 'string') {
            setTreeData(data.data);
            setRepoNotClonedYet(false)
            setSuccess('Git Repo fetch successful')
        } else {
            setError(data.error);
        }
    };

    /**
     * POST method to save the edited file and commit/push to repo
     * Once this has completed, GET the repo data again to ensure you have the most up-to-date version
     */
    const saveFileContent = async (): Promise<void> => {
        try {
            const response: Response = await fetch('api/save-file', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    path: selectedFilePath,
                    content: selectedFileContent,
                }),
            })

            await response.json()
            if(response.ok){
                await fetchData()
            }
        }
        catch{
            setError('No file selected')
        }
    }

    /**
     * Hide the folder tree, text area and save file button until the repo has been cloned successfully and can be accessed
     */
    return (
        <main className='p-8 m-4 rounded-2xl border-2'>
            {repoNotClonedYet ? <h1 className='flex justify-center text-xl'> Clone a Git Repository to Get Started</h1> : (
                <>
                    <div className='flex justify-center'>
                        <h1 className='text-xl'>Click on a file name to begin editing</h1>
                    </div>
                    <div className='flex justify-center m-4'>
                        {error && <p className='text-red-600'>{error}</p>}
                        {success && <p className='text-green-600'>{success}</p>}
                    </div>

                    <div className='flex justify-between p-2 mt-4'>
                        <div className='w-1/2'>
                            {treeData && (
                                <FolderTree
                                    indentPixels={0.5}
                                    data={treeData}
                                    showCheckbox={false}
                                    onNameClick={({defaultOnClick, nodeData }) => {
                                        defaultOnClick()
                                        if (nodeData.type === 'file') {
                                            setSelectedFileContent(nodeData.content);
                                            setSelectedFilePath(nodeData.path);
                                        }
                                    }}
                                />
                            )}
                        </div>
                        <div className='w-1/2'>
                            {selectedFileContent &&(
                                <>
                                    <textarea
                                        value={selectedFileContent}
                                        onChange={(e) => setSelectedFileContent(e.target.value)}
                                        className="w-full h-96 font-mono text-xs border boder-gray-300 rounded-md p-2.5 text-black"
                                    />
                                    <button className='mt-4 p-2 w-full bg-purple-500 rounded-2xl' onClick={saveFileContent}>
                                        Save File
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </main>
    );
}