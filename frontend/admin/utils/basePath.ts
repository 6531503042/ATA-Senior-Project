export function withBasePath(path: string): string {
	if (!path) return '';
	const base = (process.env.NEXT_PUBLIC_BASE_PATH as string) || '/admin';
	if (path.startsWith('http://') || path.startsWith('https://')) return path;
	return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
}
