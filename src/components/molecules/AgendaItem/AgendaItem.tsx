import isEmpty from 'lodash/isEmpty';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import testIDs from '@/screens/Calendar/testIDs';
import type { AgendaItemData } from '@/types/schemas/agendaItemType';
import { hoursAndMinutes } from '@/helpers/utils/formatTime';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '@/theme';
import { SetTimeDialog } from '@/components/molecules';
import { useTranslation } from 'react-i18next';
import { useAgendaItems } from '@/helpers/hooks/useAgendaItems';

const styles = StyleSheet.create({
	itemButtonContainer: {
		flex: 1,
		alignItems: 'flex-end',
	},
	emptyItem: {
		paddingLeft: 20,
		height: 52,
		justifyContent: 'center',
		borderBottomWidth: 1,
		borderBottomColor: 'lightgrey',
	},
	emptyItemText: {
		color: 'lightgrey',
		fontSize: 14,
	},
});

interface ItemProps {
	item: AgendaItemData;
	handleDelete: () => void;
	handleComplete: () => void;
}

function AgendaItem(props: ItemProps) {
	const { item, handleDelete, handleComplete } = props;
	const { backgrounds, fonts, layout, gutters, borders } = useTheme();
	const { t } = useTranslation(['common']);
	const [duration, setDuration] = useState(item.duration);
	const [date, setDate] = useState<Date | undefined>(
		item.time ? new Date(item.time) : undefined,
	);
	const [showDialog, setShowDialog] = useState(false);
	const { updateAgendaItem } = useAgendaItems();
	const itemPressed = useCallback(() => {
		setShowDialog(true);
	}, []);
	const changeTime = (newDuration: number, newDate?: Date) => {
		setDate(newDate);
		setDuration(newDuration);
		setShowDialog(false);
		updateAgendaItem({ ...item, time: newDate, duration: newDuration });
	};

	const renderTime = () => {
		if (date) {
			const startTime = hoursAndMinutes(date);
			const timeInMillis = date.getTime();
			const newTimeInMillis = timeInMillis + duration * 60000;
			const newDate = new Date(newTimeInMillis);
			const endTime = hoursAndMinutes(newDate);
			return (
				<View>
					<Text style={fonts.gray200}>{startTime}</Text>
					{startTime !== endTime && (
						<Text style={fonts.gray200}>{endTime}</Text>
					)}
				</View>
			);
		}
		const hours = Math.floor(duration / 60);
		const minutes = duration % 60;
		return (
			<Text style={fonts.gray200}>
				{hours}
				{t('common:abr.hour')} {minutes}
				{t('common:abr.min')}
			</Text>
		);
	};
	if (isEmpty(item))
		return (
			<View style={styles.emptyItem}>
				<Text style={styles.emptyItemText}>No Events Planned Today</Text>
			</View>
		);

	return (
		<View>
			<SetTimeDialog
				onEdit={changeTime}
				onCancel={() => setShowDialog(false)}
				visible={showDialog}
				oldDate={date}
				oldDuration={duration}
			/>
			<TouchableOpacity
				onPress={itemPressed}
				style={[
					layout.row,
					gutters.padding_16,
					borders.gray100,
					borders.w_1,
					item.completed ? backgrounds.green400 : backgrounds.purple100,
				]}
				testID={testIDs.agenda.ITEM}
			>
				{renderTime()}
				<Text
					style={[
						fonts.gray200,
						fonts.size_16,
						fonts.bold,
						gutters.marginLeft_16,
					]}
				>
					{item.title}
				</Text>
				<View style={styles.itemButtonContainer}>
					{!item.completed && (
						<TouchableOpacity onPress={handleComplete}>
							<MaterialCommunityIcons name="check" size={20} color="green" />
						</TouchableOpacity>
					)}
					<TouchableOpacity onPress={handleDelete}>
						<MaterialCommunityIcons color="red" name="delete" size={20} />
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
		</View>
	);
}

export default React.memo(AgendaItem);
