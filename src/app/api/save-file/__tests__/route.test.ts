import {PUT} from '../route';
import { NextRequest} from 'next/server';
import { expect, test } from 'vitest';

const apiUrl:string = 'http://localhost:3000'

test('PUT in /api/save-file should return 500 on an incorrect file path', async () => {

    const req: NextRequest = new NextRequest(`${apiUrl}/api/save-file`, {
        method: 'PUT',
        body: JSON.stringify({
            path: '/testing/repo/Automated-Court-Booker/README.md',
            content: 'this will not be updated by the test suite'
        })
    })

    const res: Response = await PUT(req)
    expect(res.status).toBe(500)
})
