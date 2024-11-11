import { ImageResponse } from 'next/og';
import { join } from 'node:path'
import { readFile } from 'node:fs/promises'

import { sysVarConfiguration } from '@/sysVarConfiguration';

export const contentType = 'image/png'

export default async function Image({ params }: { params: { key: string } }) {
	const logoData = await readFile(join(process.cwd(), 'public', 'logo.png'))
	const logoBase64 = logoData.toString('base64')
	const logoSrc = `data:image/png;base64,${logoBase64}`;

	return new ImageResponse(
		(
			<div style={{
				width: '100%',
				height: '100%',
				background: 'white',
				display: 'flex',
				textAlign: 'center',
				alignItems: 'center',
				justifyContent: 'space-between',
				flexDirection: 'column',
				padding: 30
			}}>

				<div
					style={{
						height: 100,
						width: 100,
						backgroundImage: `url(${logoSrc})`,
						backgroundSize: '100px 100px',
						backgroundRepeat: 'no-repeat',
					}}
				/>

				<div style={{ fontSize: 96, marginTop: 0, lineHeight: 1 }}>
					{sysVarConfiguration[params.key]?.customName}
				</div>

				<div style={{ fontSize: 24 }}>
					{sysVarConfiguration[params.key]?.short_description}
				</div>

				<div style={{ marginBottom: 0 }}>governance.obyte.org</div>
			</div>
		),
		{
			width: 1200,
			height: 600,
		}
	)
};
