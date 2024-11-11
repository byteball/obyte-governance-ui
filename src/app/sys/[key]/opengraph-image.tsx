import { sysVarConfiguration } from '@/sysVarConfiguration';
import { ImageResponse } from 'next/og';

export const contentType = 'image/png'

export default function Image({ params }: { params: { key: string } }) {
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
				border: '5px solid #000',
				padding: 30
			}}>
				<div style={{ fontSize: 96, marginTop: 100 }}>
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
