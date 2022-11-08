import { useCallback, useMemo, useRef, useState } from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

function App() {
	const [data, setData] = useState([]);

	const dataId = useRef(0);

	const onCreate = useCallback((author, content, emotion) => {
		const created_date = new Date().getTime();
		const newItem = {
			author,
			content,
			emotion,
			created_date,
			id: dataId.current,
		};

		dataId.current += 1;
		setData(data => [newItem, ...data]);
	}, []);

	const onRemove = targetId => {
		const newDiaryList = data.filter(element => element.id !== targetId);
		setData(newDiaryList);
	};

	const onEdit = (targetId, newContent) => {
		setData(
			data.map(element =>
				element.id === targetId ? { ...element, content: newContent } : element,
			),
		);
	};

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
