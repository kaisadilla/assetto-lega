<div className="gp-entry">
	<div className="gp-flag-container">
		<FlagImage className="gp-flag" country={entry.country} />
	</div>
	<div className="gp-name">
		{entry.name}
	</div>
	<div className="track-outline">
		<img src={FILE_PROTOCOL + layout.outlinePath} />
	</div>
	<div className="track-name">
		{layout.ui.name}
	</div>
</div>

.gp-entry {
	background: $color-transparent-w3;
	display: flex;
	align-items: center;
	gap: 4px;

	&:hover {
		background: $color-primary;
	}

	.gp-flag-container {
		width: $-flag-size * 3;
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100%;

		.gp-flag {
			min-height: $-flag-size;
			min-width: $-flag-size;
			max-width: 38px;
			max-height: 38px;
			border: 1px solid $text-color-dark-d2;
		}
	}

	.gp-name {
		flex: 1;
		@include ellipsis();

		max-width: 300px;
	}

	.track-outline {
		width: 64px;
		height: 100%;
		background: $color-transparent-w2;

		img {
			width: 100%;
			height: 100%;
		}
	}

	.track-name {
		flex: 2;
		@include ellipsis();
		font-family: $font-std;
	}
}
