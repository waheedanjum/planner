import { useMutation, UseMutationResult } from '@tanstack/react-query';

import { editTask } from '@/services/goals/tasks';
import { TaskVariables } from '@/types/schemas/task';

export default (): UseMutationResult<void, Error, TaskVariables> => {
	return useMutation({
		mutationFn: ({ task, token }: TaskVariables) => {
			return editTask(task, token);
		},
	});
};
