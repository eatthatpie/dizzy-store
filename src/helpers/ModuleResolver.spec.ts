import ModuleResolver from './ModuleResolver';

describe(`Module resolver`, () => {
    it(`should throw error if path is corrupted`, () => {
        expect(() => ModuleResolver.resolvePath('some.strange.path')).toThrow();

        expect(() => ModuleResolver.resolvePath('no-dot-path')).toThrow();
    });

    it(`should resolve module name and module param`, () => {
        const { moduleName, moduleParam } = ModuleResolver.resolvePath('test.paramName');

        expect({ moduleName, moduleParam }).toEqual({ moduleName: 'test', moduleParam: 'paramName' });
    })

    test(`module names are the same if the segments before dots match`, () => {
        expect(ModuleResolver.moduleNamesMatch('test.name1', 'test1.name1')).toBeFalsy();

        expect(ModuleResolver.moduleNamesMatch('test2.name1', 'test2.name2')).toBeTruthy();
    });
});