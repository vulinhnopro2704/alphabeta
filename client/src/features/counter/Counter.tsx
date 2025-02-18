import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
	decrement,
	increment,
	incrementAsync,
	incrementByAmount,
	incrementIfOdd,
	selectCount,
	selectStatus,
} from "./counterSlice";
import { useState } from "react";
import styles from "./Counter.module.css";

export const Counter = () => {
	const dispatch = useAppDispatch();
	const count = useAppSelector(selectCount);
	const status = useAppSelector(selectStatus);
	const [incrementAmount, setIncrementAmount] = useState("2");

	const incrementValue = Number(incrementAmount) || 0;

	return (
		<div>
			<div className={styles.row}>
				<button
					className={styles.button}
					aria-label="Decrement value"
					onClick={() => dispatch(decrement())}
				>
					-
				</button>
				<span aria-label="Count" className={styles.value}>
					{count}
				</span>
				<button
					className={styles.button}
					aria-label="Increment value"
					onClick={() => dispatch(increment())}
				>
					+
				</button>
			</div>
			<div className={styles.row}>
				<input
					className={styles.textbox}
					aria-label="Set increment amount"
					value={incrementAmount}
					type="number"
					onChange={(e) => {
						setIncrementAmount(e.target.value);
					}}
				/>
				<button
					className={styles.button}
					onClick={() => dispatch(incrementByAmount(incrementValue))}
				>
					Add Amount
				</button>
				<button
					className={styles.asyncButton}
					disabled={status !== "idle"}
					onClick={() => dispatch(incrementAsync(incrementValue))}
				>
					Add Async
				</button>
				<button
					className={styles.button}
					onClick={() => {
						dispatch(incrementIfOdd(incrementValue));
					}}
				>
					Add If Odd
				</button>
			</div>
			<div>
				Use TailwindCSS
				<div className="flex justify-center items-center">
					<div className="flex justify-center items-center">
						<button
							className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
							onClick={() => dispatch(increment())}
						>
							Increment
						</button>
						<span className="mx-4">{count}</span>
						<button
							className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
							onClick={() => dispatch(decrement())}
						>
							Decrement
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
