namespace app.auth {
	'use strict';

	interface IRetryItem {
		name: string;
	}

  export interface IRetryQueue {
		onItemAddedCallbacks: any;
 		hasMore: () => void;
		push: (item: IRetryItem) => void;
		pushRetryFn: (reason: string, retryFn: Function) => void;
		retryReason: () => void;
		cancelAll: () => void;
		retryAll: () => void;
		clear: () => void;
	}

	class RetryQueue implements IRetryQueue {
				onItemAddedCallbacks: any;

		hasMore: () => void;
		push: (item: IRetryItem) => void;
		pushRetryFn: (reason: string, retryFn: Function) => void;
		retryReason: () => void;
		cancelAll: () => void;
		retryAll: () => void;
		clear: () => void;
	}
}

	