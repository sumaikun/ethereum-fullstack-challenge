import React, { useState, useEffect } from "react";
import Challenge1Card from "../components/challenges/Challenge1Card";
import Challenge2Card from "../components/challenges/Challenge2Card";
import Challenge3Card from "../components/challenges/Challenge3Card";
import Challenge4Card from "../components/challenges/Challenge4Card";
import RightSidebar from "../components/challenges/RightSidebar";
import Modal from "../components/Modal";
import { Frown } from "lucide-react"
import { LOCAL_API_URL } from "../constants";
import axios from 'axios';

const getIpfsCidUrl = `${LOCAL_API_URL}/ipfs`

const Challenges = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState("");
    const [ipfsData, setIpfsData] = useState([]);

    const showErrorModal = (message) => {
        setModalContent(message);
        setIsModalOpen(true);
    };

    const fetchIPFSData = async () => {
        try {
            const response = await axios.get(getIpfsCidUrl);
            setIpfsData(response.data.data);
        } catch (error) {
            console.error("Error fetching IPFS data:", error);
        }
    };

    useEffect(() => {
        fetchIPFSData();
    }, []);

    return (
        <div className="container mx-auto p-6 relative">

            <div className="flex-grow">
                <h1 className="text-3xl font-bold mb-6 text-left">Challenges</h1>
                <Challenge1Card onError={(msg) => showErrorModal(msg)} />
                <Challenge2Card onError={(msg) => showErrorModal(msg)} />
                <Challenge3Card onError={(msg) => showErrorModal(msg)} fetchIPFSData={fetchIPFSData} />
                <Challenge4Card onError={(msg) => showErrorModal(msg)} />
            </div>

            <RightSidebar ipfsData={ipfsData} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Error"
            >
                <div className="flex items-center space-x-2">
                    <Frown className="text-red-500" size={24} />
                    <p>{modalContent}</p>
                </div>
            </Modal>
        </div>
    );
};

export default Challenges;
