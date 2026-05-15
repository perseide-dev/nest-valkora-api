import { FindOptionsRelations } from 'typeorm';

/**
 * Convierte un string de includes (separado por comas y puntos para anidación)
 * en un objeto compatible con TypeORM relations.
 * Ejemplo: "rol,controlGroups.users" -> { rol: true, controlGroups: { users: true } }
 */
export function parseIncludes(includeStr?: string): FindOptionsRelations<any> {
    if (!includeStr) return {};

    const relations: any = {};
    const paths = includeStr.split(',').map(p => p.trim());

    for (const path of paths) {
        const parts = path.split('.');
        let current = relations;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (i === parts.length - 1) {
                current[part] = current[part] || true;
            } else {
                current[part] = typeof current[part] === 'object' ? current[part] : {};
                current = current[part];
            }
        }
    }

    return relations;
}
