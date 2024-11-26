import {NextRequest, NextResponse} from "next/server";
import path from "path";
import * as fs from "fs";

type FileNode = {
    name: string;
    path: string;
    type: 'file' | 'folder';
    content?: string;
    children?: FileNode[];
}

type ResponseDataGetRepo = {
    status: number;
    data: FileNode[] | string;
}

export async function GET(): Promise<NextResponse>{
    let returnData:ResponseDataGetRepo | undefined
    const excludeList = ['.git', 'node_modules', '.DS_Store', 'Thumbs.db'];
    const reposPath = path.join(process.cwd(), '..', 'repo');

    const readFilesRecursively = (dirPath: string): FileNode[] => {
        const entries = fs.readdirSync(dirPath, { withFileTypes: true });
        const files: FileNode[] = [];

        entries.forEach((entry) => {
            if (excludeList.includes(entry.name)) {
                return;
            }
            const fullPath = path.join(dirPath, entry.name);
            if (entry.isDirectory()) {
                files.push({
                    name: entry.name,
                    path: fullPath,
                    type: 'folder',
                    children: readFilesRecursively(fullPath),
                });
            } else {
                const content = fs.readFileSync(fullPath, 'utf-8')
                files.push({
                    name: entry.name,
                    path: fullPath,
                    type: 'file',
                    content
                });
            }
        });
        return files;
    };

    try {
        const filesData = readFilesRecursively(reposPath);
        return NextResponse.json({name: 'repo', path: reposPath, type: 'folder', children: filesData})
    } catch{
        returnData = {status:400, data:'Error reading files'}
        return NextResponse.json(returnData);
    }
}

