"use client"
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

const Drop_down = ({openIndex, item, handle_analysis_deletion}) => {
    const [poi, setpoi] = useState(null);

    let audio_model_count = 0;
    let frame_model_count = 0;

    useEffect(() => {
        const get_poi_data = async () => {
            if (openIndex !== null) {
                const poi_id = item.poi_id;
                if (poi_id) {
                    try {
                        const response = await fetch(`/api/get_poi?poi_id=${poi_id}`);
                        if (!response.ok) throw new Error("Failed to fetch POI data");
                        const poiData = await response.json();
                        setpoi(poiData);
                    } catch (error) {
                        console.error("Error fetching POI:", error);
                    }
                } else {
                    setpoi(null);
                }
            }
            else {
                setpoi(null);
            }
        };
        get_poi_data();
    }, []);

    return (
        <div className=" p-4 border-b-4 border-x-2 border-t border-primary flex w-full justify-between">
            {/* POI DETAILS */}
            {
                poi !== null ?
                    <div className=' w-fit min-w-52'>
                        <div className='text-lg font-semibold '>
                            Person Searched :
                        </div>
                        <div className='flex items-center gap-5 my-5'>
                            <Image className='rounded-full' alt='POI image' src={poi.img_url} width={75} height={75} />
                            <div className=' text-lg '>
                                {poi.name}
                            </div>
                        </div>
                    </div>
                    :
                    <>
                    </>
            }

            {/* for video  */}
            <div className=' w-full flex flex-col justify-evenly gap-2 items-center overflow-hidden'>
                <video
                    src={item["view_url"]}
                    controls
                    className='max-h-72 w-full'
                />

                <div onClick={() => { handle_analysis_deletion() }} className=' w-fit bg-red-200 hover:bg-red-300 px-5  p-2 cursor-pointer flex items-center gap-2 transition-all '>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                    <span className=' text-sm text-center'>
                        Delete Analysis
                    </span>
                </div>
            </div>

            {/* RESULT */}
            <div className=' w-full flex flex-col items-center justify-between gap-4'>
                <div className='mx-auto'>
                    {
                        (item.results === undefined) ?
                            (
                                <div className='w-full text-xl text-center py-4 '>
                                    This file is queued for analysis
                                </div>
                            )
                            :
                            (
                                <>
                                    {/* for Clips data */}
                                    <div className=' w-[450px] border border-primary/30 px-2 py-2 overflow-hidden '>
                                        {
                                            item.results.length === 0 ?
                                                <div className='w-full text-xl text-center py-4 '>
                                                    Video doesn&apos;t contain the requested POI
                                                </div>
                                                :

                                                <div className='flex px-3'>
                                                    <h3 className="w-full text-lg font-semibold mb-4 pt-4 pb-2 px-4">Model </h3>
                                                    <h3 className="text-lg font-semibold mb-4 pt-4 pb-2 pl-4 pr-4 ">Prediction</h3>
                                                    <h3 className="text-lg font-semibold mb-4 pt-4 pb-2 pr-4">Score</h3>
                                                </div>
                                        }

                                        <div className=" divide-y max-h-80 overflow-y-auto  ">
                                            {
                                                item.results.map((model, model_index) => {
                                                    
                                                    frame_model_count += model.model_type === "frame"? 1 : 0;
                                                    audio_model_count += model.model_type === "audio"? 1 : 0;

                                                    return (
                                                        <div key={model_index} className="bg-white py-4 px-4 hover:bg-primary/5 ">
                                                            <div className="flex justify-start">
                                                                <div className=" w-full ">
                                                                    {`${model.model_type}-check ${ model.model_type==="frame"? frame_model_count : audio_model_count}`}
                                                                </div>
                                                                <div className={` mx-6 px-4 py-1 text-sm ${model.result === 'real' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                    {model.result}
                                                                </div>
                                                                <div className={`px-4 py-1 text-sm ${model.result === 'real' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                                    {model.score.toFixed(2)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                </>
                            )
                    }
                </div>
            </div>
        </div>
    )
};

export default Drop_down;