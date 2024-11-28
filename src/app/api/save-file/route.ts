import {NextRequest, NextResponse} from "next/server";
import path from "path";
import * as fs from "fs";
import simpleGit, {SimpleGit} from "simple-git";

export type RequestDataSaveFile = {
    path:string;
    content:string;
}

/**
 * PUT method to save the new file contents
 * Save the file which was edited
 * Git add, commit and push to its repo
 * Error handling
 */
export async function PUT(request: NextRequest): Promise<NextResponse>{
    const requestData: RequestDataSaveFile = await request.json()
    const saveToPath: string = path.resolve(process.cwd(), requestData.path)

    try{
        fs.writeFileSync(saveToPath, requestData.content, 'utf8');
        const git: SimpleGit = simpleGit(path.dirname(saveToPath));
        await git.add('.');
        await git.commit('Update file through Git Visualizer', requestData.path);
        await git.push();
    }
    catch{
        return NextResponse.json({data:'Error saving to git repo'}, {status:500})
    }
    return NextResponse.json({data:'Successfully saved git repo'}, {status:200})
}