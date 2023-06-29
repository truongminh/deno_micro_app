export function NewLogger(id: string) {
    const prefix = `[id=${id}]`;
    return {
        info: (...args: any[]) => console.log(new Date(), ...args),
        error: (...args: any[]) => console.error(new Date(), ...args),
    }
}

export const logger = NewLogger("main");
