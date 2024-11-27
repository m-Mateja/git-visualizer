import { NextRequest, NextResponse } from 'next/server';
import simpleGit, { SimpleGit } from 'simple-git';
import { promises as fs } from 'fs';
import path from 'path';
import {Simulate} from "react-dom/test-utils";

type ResponseDataCloneRepo = {
    success: boolean
    status: number
    data?: string
    error?: string
}

type RequestDataCloneRepo = {
    repoUrl: string
}

export async function POST(request: NextRequest): Promise<NextResponse<ResponseDataCloneRepo>> {
    let returnData: ResponseDataCloneRepo | undefined = undefined
    const git: SimpleGit = simpleGit();
    const requestData:RequestDataCloneRepo  = await request.json()
    const repoUrl:string = requestData.repoUrl

    if (repoUrl.length == 0){
        return NextResponse.json(failedRequest('No input detected'))
    }

    const repoName:string = path.basename(repoUrl, '.git');
    const reposDir: string = path.join(process.cwd(), '..', 'repo');
    const cloneDir: string = path.join(reposDir, repoName);
    console.log(cloneDir)

    try {
        await fs.access(reposDir);
        await fs.rm(reposDir, { recursive: true, force: true })
    } catch {
        console.log('No repo directory... proceeding to create one')
    }

    try{
        await fs.mkdir(reposDir)
        await git.clone(repoUrl, cloneDir);
        returnData = successfulRequest('Git Repo cloned successfully')
    }
    catch{
        returnData = failedRequest('Error cloning git repo')
    }
    return NextResponse.json(returnData)
}

function failedRequest(data:string):ResponseDataCloneRepo{
    return {success:false, status:500, error:'Internal Server Error', data:data}
}
function successfulRequest(data:string):ResponseDataCloneRepo{
    return {success:true, status:200, data:data}
}

