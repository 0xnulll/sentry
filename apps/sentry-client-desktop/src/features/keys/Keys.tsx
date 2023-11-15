import {useState} from "react";
import {HasKeys} from "./HasKeys.js";
import {NoKeys} from "./NoKeys.js";
import {ContinueInBrowserModal} from "../home/modals/ContinueInBrowserModal.js";
import {AiFillWarning, AiOutlineInfoCircle} from "react-icons/ai";
import {drawerStateAtom, DrawerView} from "../drawer/DrawerManager";
import {useAtom} from "jotai";
import {getLicensesList, useListNodeLicensesWithCallback} from "@/hooks/useListNodeLicensesWithCallback";
import {useOperator} from "@/features/operator";
import {useListOwnersForOperatorWithCallback} from "@/hooks/useListOwnersForOperatorWithCallback";
import {useKycStatusesWithCallback} from "@/hooks/useKycStatusesWithCallback";
import {Tooltip} from "@/features/keys/Tooltip";

export function Keys() {
	const [drawerState, setDrawerState] = useAtom(drawerStateAtom);
	const [showContinueInBrowserModal, setShowContinueInBrowserModal] = useState<boolean>(false);

	const {publicKey} = useOperator();
	const {isLoading: ownersLoading, owners} = useListOwnersForOperatorWithCallback(publicKey, true);

	// todo arbitrary list of manual-adds []
	const combinedOwners = [...owners];

	const {isLoading: kycStatusesLoading, statusMap} = useKycStatusesWithCallback(combinedOwners);
	console.log("statusMap:", statusMap);
	const {isLoading: licensesLoading, licensesMap} = useListNodeLicensesWithCallback(combinedOwners);

	const keyCount = getLicensesList(licensesMap).length;

	return (
		<div className="w-full h-screen">
			<div className="flex flex-row justify-between items-center border-b border-gray-200 pl-10 pr-2">
				<div className="top-0 flex flex-row items-center h-16 gap-2 bg-white">
					<h2 className="text-lg font-semibold">Keys</h2>
					<p className="text-sm bg-gray-100 pl-2 pr-2 rounded-2xl text-gray-500">
						{keyCount} key{keyCount === 1 ? "" : "s"} in {owners.length} wallet{owners.length === 1 ? "" : "s"}
					</p>
					<Tooltip
						header={"Xai Client can track keys only from added wallets"}
						body={"If you own keys in additional wallets, add them to the client."}
						width={452}
					>
						<AiOutlineInfoCircle size={16} className="text-[#A3A3A3]"/>
					</Tooltip>
				</div>

				{drawerState === null && (
					<div className="flex gap-4 bg-[#FFFBEB] p-2 z-10">
						<div className="flex flex-row gap-2 items-center">
							<AiFillWarning className="w-7 h-7 text-[#F59E28]"/>
							<span className="text-[#B45317] text-[15px] font-semibold">Actions required (Buy)</span>
						</div>
						<button
							onClick={() => setDrawerState(DrawerView.ActionsRequiredBuy)}
							className={`flex flex-row justify-center items-center py-1 px-4 gap-1 bg-[#F30919] text-[15px] text-white font-semibold`}
						>
							Resolve
						</button>
					</div>
				)}
			</div>

			{showContinueInBrowserModal && (
				<ContinueInBrowserModal setShowContinueInBrowserModal={setShowContinueInBrowserModal}/>
			)}

			{!ownersLoading && !kycStatusesLoading && !licensesLoading && keyCount === 0 ? (
				<NoKeys/>
			) : (
				<>
					{(ownersLoading || licensesLoading) || keyCount === 0 ? (
						<div className="w-full h-full flex-1 flex flex-col justify-center items-center">
							<h3 className="text-center">Loading...</h3>
						</div>
					) : (
						<HasKeys
							licensesMap={licensesMap}
							statusMap={statusMap}
						/>
					)}
				</>
			)}
		</div>
	)
}
