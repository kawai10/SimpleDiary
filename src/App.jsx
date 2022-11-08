import { useCallback, useMemo, useReducer, useRef } from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

const reducer = (state, action) => {
	switch (action.type) {
		case 'CREATE': {
			const created_date = new Date().getTime();
			const newItem = {
				...action.data,
				created_date,
			};
			return [newItem, ...state];
		}
		case 'REMOVE': {
			return state.filter(element => element.id !== action.targetId);
		}
		case 'EDIT': {
			return state.map(element =>
				element.id === action.targetId
					? { ...element, content: action.newContent }
					: element,
			);
		}
		default:
			return state;
	}
};

function App() {
	// const [data, setData] = useState([]);

	const [data, dispatch] = useReducer(reducer, []);

	const dataId = useRef(0);

	const onCreate = useCallback((author, content, emotion) => {
		dispatch({
			type: 'CREATE',
			data: {
				author,
				content,
				emotion,
				id: dataId.current,
			},
		});

		dataId.current += 1;
	}, []);

	const onRemove = useCallback(targetId => {
		dispatch({
			type: 'REMOVE',
			targetId,
		});
	}, []);

	const onEdit = useCallback((targetId, newContent) => {
		dispatch({
			type: 'EDIT',
			targetId,
			newContent,
		});
	}, []);

	const getDiaryAnalysis = useMemo(() => {
		const goodCount = data.filter(element => element.emotion >= 3).length;
		const badCount = data.length - goodCount;
		const goodRatio = (goodCount / data.length) * 100;

		return { goodCount, badCount, goodRatio };
	}, [data.length]);

	const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

	return (
		<div className='App'>
			<DiaryEditor onCreate={onCreate} />
			<div>전체 일기 : {data.length}</div>
			<div>기분 좋은 일기 개수 : {goodCount}</div>
			<div>기분 나쁜 일기 개수 : {badCount}</div>
			<div>기분 좋은 일기 비율 : {goodRatio}</div>
			<DiaryList diaryList={data} onRemove={onRemove} onEdit={onEdit} />
		</div>
	);
}

export default App;
