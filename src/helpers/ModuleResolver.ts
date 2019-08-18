export default class ModuleResolver {
    public static resolvePath(modulePath: string) {
        if (!/^[^\.]+\.[^\.]+$/.test(modulePath)) {
            throw new Error(`Invalid module path.`);
        }

        const pathSegments = modulePath.split('.');

        return {
            moduleName: pathSegments[0],
            moduleParam: pathSegments[1]
        };
    }

    public static moduleNamesMatch(modulePath1: string, modulePath2: string): Boolean {
        const resolvedPath1 = this.resolvePath(modulePath1);
        const resolvedPath2 = this.resolvePath(modulePath2);

        return resolvedPath1.moduleName === resolvedPath2.moduleName;
    }
}