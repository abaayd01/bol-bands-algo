<template>
    <v-container>
        <div class="tradingview" id="tradingview" ref="chart-container">
        </div>
    </v-container>
</template>

<script>
	import PriceSnapshotsQuery from "../graphql/priceSnapshot/PriceSnapshots.gql";

	export default {
		apollo: {
			priceSnapshots: {
				query: PriceSnapshotsQuery
			}
		},
		data: () => ({
			// Array will be automatically processed with visualization.arrayToDataTable function
			chartOptions: {
				chart: {
					title: 'Price Snapshots',
				}
			}
		}),
		computed: {
			chartData() {
				const dataHeadings = ['Date', 'Price'];

				if (this.priceSnapshots) {
					// TODO: do data filtering server-side
					const dataSet = this.priceSnapshots.slice(0, 50).reverse();
					const dataPoints = dataSet.map(priceSnapshot => {
						return [this.$options.filters.moment(priceSnapshot.date, 'DD-MM-YY'), priceSnapshot.price];
					});


					return [dataHeadings, ...dataPoints];
				}
				return [dataHeadings];
			}
		},
		mounted() {
			// eslint-disable-next-line no-undef
			new TradingView.widget(
				{
					"width": 980,
					"height": 610,
					"symbol": "ETHUSD",
					"interval": "D",
					"timezone": "Etc/UTC",
					"theme": "Light",
					"style": "1",
					"locale": "en",
					"toolbar_bg": "#f1f3f6",
					"enable_publishing": false,
					"allow_symbol_change": true,
					"container_id": "tradingview"
				}
			);

			const tradingviewWrapper = this.$refs['chart-container'].querySelector("[id^='tradingview']");
			tradingviewWrapper.style.marginLeft = '0';
			// console.log(tradingviewWrapper);
		}
	};
</script>

<style scoped lang="scss">
    .price-chart {
        height: 100%;
    }

    /*/deep/ .tradingview > div {*/
    /*    margin-left: 0 !important;*/
    /*}*/
</style>
