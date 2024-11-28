import { NextRequest, NextResponse } from 'next/server';
import simpleGit, { SimpleGit } from 'simple-git';
import { promises as fs } from 'fs';
import path from 'path';
import {FileNode} from "@/app/api/get-repo/route";

export interface ResponseData {
    data?:string | FileNode
    error?:string
}

type RequestDataCloneRepo = {
    repoUrl: string
}

/**
 * POST request which clones git repo, and creates a directory for it
 * Handle no input, or invalid inputs
 * Set directory one level up from the working directory of this project
 * If there is another repo in the git directory, replace with a new one
 * Git clone into the 'repo' directory, and handle possible errors
 */
export async function POST(request: NextRequest): Promise<NextResponse<ResponseData>> {
    const git: SimpleGit = simpleGit();
    const requestData: RequestDataCloneRepo = await request.json()
    const repoUrl: string = requestData.repoUrl

    if (repoUrl.length == 0) {
        return NextResponse.json({error:'No input detected'}, {status: 500})
    }

    const repoName: string = path.basename(repoUrl, '.git');
    const reposDir: string = path.join(process.cwd(), '..', 'repo');
    const cloneDir: string = path.join(reposDir, repoName);

    try {
        await fs.access(reposDir);
        await fs.rm(reposDir, {recursive: true, force: true})
    } catch {
        console.log('No repo directory... proceeding to create one')
    }

    try {
        await fs.mkdir(reposDir)
        await git.clone(repoUrl, cloneDir);
        return NextResponse.json({data: 'Git Repo cloned successfully'}, {status:200})
    } catch {
        return NextResponse.json({error:'Git Repo does not exist or is private'}, {status: 500})
    }
}

