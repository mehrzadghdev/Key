export const environment: Environment = {
    apiUrl: "https://api.keyacc.ir/" as const,
    isDevMode: true as const,
} as const;

interface Environment {
    readonly apiUrl: string;
    readonly isDevMode: boolean;
}