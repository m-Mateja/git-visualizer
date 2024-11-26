import { NextRequest, NextResponse } from 'next/server';
import simpleGit, { SimpleGit } from 'simple-git';
import { promises as fs } from 'fs';
import path from 'path';

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
    const cloneDir:string = path.join(process.cwd(), '..', 'repos', repoName);
    console.log(cloneDir)

    try {
        await fs.access(cloneDir);
        returnData = failedRequest('Git repo already cloned')
    } catch {
        await git.clone(repoUrl, cloneDir);
        returnData = successfulRequest('Git Repo cloned successfully')
    }
    return NextResponse.json(returnData)
}

function failedRequest(data:string):ResponseDataCloneRepo{
    return {success:false, status:400, data:data}
}
function successfulRequest(data:string):ResponseDataCloneRepo{
    return {success:true, status:200, data:data}
}

