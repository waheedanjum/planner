import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
import { useTheme } from '@/theme';
import type ItemCardProps from '@/types/props/itemCardProps';
import * as Progress from 'react-native-progress';
import isEmpty from 'lodash/isEmpty';
import { useTranslation } from 'react-i18next';
import { daysBetween } from '@/helpers/utils/formatTime';

function ItemCard({
	name,
	description,
	completed,
	dueDate,
	duration,
}: ItemCardProps) {
	const { layout, gutters, borders, fonts, backgrounds } = useTheme();
	const { t } = useTranslation(['goals']);
	const progress = useRef(new Animated.Value(0)).current;
	const [progressValue, setProgressValue] = useState(0);

	useEffect(() => {
		if (duration) {
			const animation = Animated.timing(progress, {
				toValue:
					duration.elapsed > duration.base
						? 1
						: duration.elapsed / duration.base,
				duration: 1000,
				useNativeDriver: false,
			});

			animation.start();

			const listenerId = progress.addListener(({ value }) => {
				setProgressValue(value);
			});

			return () => {
				progress.removeListener(listenerId);
			};
		}
	}, [duration]);

	return (
		<View
			style={[
				gutters.marginBottom_16,
				borders.gray400,
				borders.w_1,
				layout.fullWidth,
				borders.rounded_4,
				gutters.padding_16,
				completed ? backgrounds.green400 : backgrounds.purple100,
			]}
		>
			<View style={gutters.paddingRight_60}>
				<Text style={[fonts.gray200, fonts.bold, fonts.size_16]}>{name}</Text>
				<Text style={[fonts.gray200]}>{description}</Text>

				{dueDate && (
					<View>
						<Text style={fonts.gray200}>
							{t('goals:endDate')} {new Date(dueDate).toLocaleDateString()}
						</Text>
						<Text style={fonts.gray200}>
							{t('goals:daysLeft')} {daysBetween(new Date(dueDate))}
						</Text>
					</View>
				)}
			</View>
			{!isEmpty(duration) && (
				<View
					style={[
						layout.absolute,
						layout.top0,
						layout.right0,
						gutters.margin_12,
					]}
				>
					<Progress.Pie
						progress={progressValue}
						size={50}
						color="#76c7c0"
						borderWidth={2}
						borderColor="#fff"
					/>
				</View>
			)}
		</View>
	);
}

export default ItemCard;
