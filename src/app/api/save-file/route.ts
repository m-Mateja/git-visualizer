import {NextRequest, NextResponse} from "next/server";
import path from "path";
import * as fs from "fs";
import simpleGit, {SimpleGit} from "simple-git";

export type RequestDataSaveFile = {
    path:string;
    content:string;
    // commitMessage:string;
}

//TODO add some error handling
export async function POST(request: NextRequest): Promise<NextResponse>{
    const requestData: RequestDataSaveFile = await request.json()
    const saveToPath: string = path.resolve(process.cwd(), requestData.path)

    fs.writeFileSync(saveToPath, requestData.content, 'utf8');

    const git: SimpleGit = simpleGit(path.dirname(saveToPath));
    await git.add('.');
    await git.commit('Update file content via API', requestData.path);
    await git.push();

    return NextResponse.json({data:'hello world'})
}