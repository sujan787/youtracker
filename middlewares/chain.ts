import { NextMiddlewareWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server'

type MiddlewareFactory = (middleware: NextMiddlewareWithAuth) => NextMiddlewareWithAuth

export function chain(
    functions: MiddlewareFactory[],
    index = 0
): NextMiddlewareWithAuth {
    const current = functions[index]

    if (current) {
        const next = chain(functions, index + 1)
        return current(next)
    }

    return () => NextResponse.next()
}