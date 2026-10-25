
type Constructor<T = any> = new (...args: any[]) => T;

export function inject<T extends Constructor>(
    classType: T
): InstanceType<T> {
    return TypeComposer.inject(classType);
}
