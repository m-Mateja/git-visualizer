import {NextRequest, NextResponse} from "next/server";
import path from "path";
import * as fs from "fs";
import {NodeData} from "react-folder-tree";

export interface FileNode extends NodeData{
    path: string
    type: 'file' | 'folder'
    content?: string
}

/**
 * GET method for retrieving the cloned git repo from the 'repo' directory
 * Exclude certain file types for a cleaner folder structure
 * Loop through all the folders/files recursively to gather all the elements
 * If of type folder, call the function again to obtain its children
 * If of type file, no children will be added so its content can be appended
 * Add a root node which signifies the 'repo' directory. Add all the other nodes as the root nodes only child
 * Return and error handle
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function GET(): Promise<NextResponse>{
    const excludeList: string[] = ['.git', 'node_modules', '.DS_Store', 'Thumbs.db'];
    const reposPath: string = path.join(process.cwd(), '..', 'repo');

    const readFilesRecursively = (dirPath: string): FileNode[] => {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        const files: FileNode[] = [];

        entries.forEach((entry) => {
            if (excludeList.includes(entry.name)) {
                return;
            }
            const fullPath: string = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                files.push({
                    name: entry.name,
                    path: fullPath,
                    type: 'folder',
                    children: readFilesRecursively(fullPath),
                });
            } else {
                const content: string = fs.readFileSync(fullPath, 'utf-8')
                files.push({
                    name: entry.name,
                    path: fullPath,
                    type: 'file',
                    content: content
                });
            }
        });
        return files;
    };

    try {
        const filesData: FileNode[] = readFilesRecursively(reposPath);
        const rootNode: FileNode = {
            name: 'repo',
            path: reposPath,
            type: 'folder',
            children: filesData
        };
        return NextResponse.json({data:rootNode}, {status:200})
    } catch{
        return NextResponse.json({error:'Error reading files'}, {status:500});
    }
}

