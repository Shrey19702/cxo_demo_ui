"use client"
import React, { useState } from 'react';
import Link from 'next/link';

import Drop_down from '@/app/cases/Drop_down';

//SAMPLE DATA
//______________________________________________________
// const data = [
//     {
//         "_id": "672ccff772b95a743ad884d7",
//         "source_url": "https://systemaibasis.top/",
//         "upload_status": "completed",
//         "s3_key": "systemaibasis_top/raw/66db06360f5a2f74944465db.mp4",
//         "created_at": "2024-11-07 20:04:31.044000",
//         "contentType": "video/mp4",
//         "file_name": "kazmunay-preland.mp4",
//         "processing_status": "done",
//         "prediction": "real",
//         "results": [
//             {
//                 "raw_video_path": "systemaibasis_top/raw/66db06360f5a2f74944465db.mp4",
//                 "clip_path": "systemaibasis_top/preprocessed/66db06360f5a2f74944465db.mp4/clip_0.mp4",
//                 "frame": "fake",
//                 "audio": "fake",
//             },
//             {
//                 "raw_video_path": "systemaibasis_top/raw/66db06360f5a2f74944465db.mp4",
//                 "clip_path": "systemaibasis_top/preprocessed/66db06360f5a2f74944465db.mp4/clip_1.mp4",
//                 "frame": "fake",
//                 "audio": "real",
//             },
//             {
//                 "raw_video_path": "systemaibasis_top/raw/66db06360f5a2f74944465db.mp4",
//                 "clip_path": "systemaibasis_top/preprocessed/66db06360f5a2f74944465db.mp4/clip_2.mp4",
//                 "frame": "real",
//                 "audio": "real",
//             }
//         ]
//     },
// ];

export default function Data_table({ delete_media, data }) {
    const [openIndex, setOpenIndex] = useState(null);
    const [deleted, set_deleted] = useState([]);

    const toggleDropdown = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        // dd/mm/yy
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const handle_analysis_deletion = () => {

        let del_success = delete_media(data[openIndex]["_id"], data[openIndex]["s3_key"]);

        if (del_success) {
            toggleDropdown();
            set_deleted([...deleted, data[openIndex]['_id']])
        }
    }
    return (
        <div className="mx-auto px-8 w-full">
            <div className="bg-primary py-4 mb-4 hidden md:block px-8">
                <div className="grid grid-cols-12 gap-2 text-white text-sm">
                    <div className="col-span-1">S.No</div>
                    <div className="col-span-2">Filename</div>
                    <div className="col-span-1">Status</div>
                    <div className="col-span-1">Prediction</div>
                    <div className="col-span-3">Source URL</div>
                    <div className="col-span-3">Created At</div>
                    <div className="col-span-1">Action</div>
                </div>
            </div>
            {data.map((item, index) => {
                if (deleted.includes(item['_id'])) {
                    return (<></>)
                }
                return (
                    <div key={index} className=" border-b ">
                        {/* ROW DETAILS */}
                        <div className="bg-white hover:bg-primary/5  px-8 py-6 transition-all ">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-2 items-center">
                                <div className="md:col-span-1 font-semibold text-center md:text-left">
                                    <span className="inline-block bg-white rounded-full px-3 py-1 text-xs md:text-sm">
                                        {index + 1}
                                    </span>
                                </div>
                                <div className="md:col-span-2 truncate">{item.file_name}</div>
                                <div className="md:col-span-1 ">
                                    <span className=" bg-primary/20 px-3 py-1 text-xs">
                                        {item.processing_status}
                                    </span>
                                </div>
                                <div className="md:col-span-1">
                                    {
                                        item.prediction === undefined ?
                                            (
                                                <span className={`px-4 py-1 rounded-full text-xs`}>
                                                    ---
                                                </span>)
                                            :
                                            (
                                                <span className={`px-4 py-1 text-xs ${(item.prediction === 'real' || item.prediction === 'no poi') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {item.prediction}
                                                </span>
                                            )
                                    }
                                </div>
                                <Link href={item.source_url} className="md:col-span-3 hover:underline truncate text-xs md:text-sm">{item.source_url}</Link>
                                <div className="md:col-span-3 text-xs md:text-sm">{formatDate(item.created_at)}</div>
                                <div className="md:col-span-1 px-3">
                                    <button
                                        onClick={() => toggleDropdown(index)}
                                        className=" bg-primary/20 rounded-full p-2 focus:outline-none"
                                        aria-label={openIndex === index ? "Close details" : "Open details"}
                                    >
                                        <div className={` ${openIndex === index ? "rotate-180" : "  "} transition-all `} >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* DROP DOWN */}
                        {openIndex === index && (
                            <Drop_down
                                openIndex={openIndex} 
                                item = {item}
                                // poi_id={data[openIndex]?.poi_id} 
                                handle_analysis_deletion={handle_analysis_deletion}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    );
}