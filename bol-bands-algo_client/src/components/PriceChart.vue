<template>
    <GChart
            type="LineChart"
            :data="chartData"
            :options="chartOptions"
            class="price-chart"
    />
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
		}
	};
</script>

<style scoped lang="scss">
    .price-chart {
        height: 100%;
        padding: 50px;
    }
</style>
