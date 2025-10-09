

export interface Executable<TRequest, TResponse> {
    execute(params: TRequest): Promise<TResponse>;
}