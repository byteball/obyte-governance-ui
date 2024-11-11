import { ImageResponse } from 'next/og';

export const contentType = 'image/png';

export default function Image() {
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
				<div style={{ fontSize: 96, marginTop: 64, lineHeight: 1 }}>
					Obyte network governance
				</div>

				<div style={{ fontSize: 24 }}>
					Vote for system parameters such as Order Providers and variables that determine the fees. The weight of your vote is equal to the GBYTE balance of your address(es).
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
