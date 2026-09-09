export const lessons={en:[
['What is Standard Reserve?','A proposed onchain monetary system. Its policy responds to capital moving through the ETH / STANDARD market.','What does the monetary engine observe?','Net ETH flow','Social-media likes','Wallet age','introduction'],
['Capital flow','ETH entering through buys minus ETH leaving through sells is the monetary signal.','What does positive net flow mean?','More ETH entered than left','Price must double','Every banker exited','net-flow'],
['Expansion','Positive net flow puts the system in expansion. Sustained inflow can increase issuance; the expansion vault accumulates reserves.','Positive net flow leads to…','Expansion','Contraction','Guaranteed returns','policy'],
['Contraction','Zero or negative net flow tightens policy. Issuance is cut and the contraction vault supports buybacks and burns. Contraction does not mean issuance must stop.','Negative net flow leads to…','Contraction','Expansion','New charter issuance','policy'],
['Charter','A Charter is the participation NFT held by a Banker. It holds branches; retiring the last branch burns the Charter.','What holds a banker’s branches?','A Charter','A trading fee','A leaderboard profile','charters'],
['Branches','Branches accrue a proportional share of issuance. More branches change a banker’s share, not the total issuance budget.','Adding a branch changes…','Your share of issuance','The hard supply cap','The ETH signal definition','branches'],
['Expansion license','Bankers buy licenses with STANDARD to open more branches. The STANDARD spent on licenses is burned.','What happens to the license payment?','It is burned','It becomes an X score','It stays in your wallet','branches'],
['Exit and resolution','Retiring a branch realizes its share of accrued earnings, minus the resolution fee. Closing the last branch ends the Charter.','What should a banker examine before exiting?','Resolution fee','Community rank','Quiz score','exits']],
th:[
['Standard Reserve คืออะไร?','แนวคิดระบบการเงินบนเชนที่ปรับนโยบายตามเงินทุนที่เคลื่อนผ่านตลาด ETH / STANDARD','กลไกการเงินพิจารณาอะไร?','กระแส ETH สุทธิ','ยอดไลก์','อายุกระเป๋า','introduction'],
['กระแสเงินทุน','ETH ที่เข้าจากการซื้อลบ ETH ที่ออกจากการขาย คือสัญญาณทางการเงิน','กระแสสุทธิเป็นบวกหมายถึงอะไร?','ETH เข้ามากกว่าออก','ราคาต้องเพิ่มสองเท่า','นายธนาคารถอนตัวหมด','net-flow'],
['การขยายตัว','กระแสสุทธิเป็นบวกทำให้ระบบขยายตัว เงินไหลเข้าต่อเนื่องอาจเพิ่มการจัดสรร และคลังขยายตัวสะสมเงินสำรอง','กระแสสุทธิเป็นบวกนำไปสู่…','การขยายตัว','การหดตัว','ผลตอบแทนรับประกัน','policy'],
['การหดตัว','กระแสสุทธิเป็นศูนย์หรือติดลบทำให้นโยบายเข้มงวด ลดการจัดสรร และคลังหดตัวซื้อคืนเพื่อเผา ไม่ได้แปลว่าการจัดสรรต้องหยุด','กระแสสุทธิติดลบนำไปสู่…','การหดตัว','การขยายตัว','การออก Charter ใหม่','policy'],
['Charter','NFT สำหรับการมีส่วนร่วมของนายธนาคาร ซึ่งถือสาขาต่าง ๆ การปิดสาขาสุดท้ายจะเผา Charter','สิ่งใดถือสาขาของนายธนาคาร?','Charter','ค่าธรรมเนียมซื้อขาย','โปรไฟล์อันดับ','charters'],
['สาขา','สาขาสะสมส่วนแบ่งการจัดสรรตามสัดส่วน การเพิ่มสาขาเปลี่ยนส่วนแบ่ง ไม่ได้เปลี่ยนงบจัดสรรรวม','การเพิ่มสาขาเปลี่ยนอะไร?','ส่วนแบ่งการจัดสรร','เพดานโทเคน','นิยามสัญญาณ ETH','branches'],
['ใบอนุญาตขยาย','นายธนาคารซื้อใบอนุญาตด้วย STANDARD เพื่อเพิ่มสาขา STANDARD ที่ใช้จะถูกเผา','เงินที่จ่ายค่าใบอนุญาตไปไหน?','ถูกเผา','กลายเป็นคะแนน X','อยู่ในกระเป๋าเดิม','branches'],
['การออกและยุติ','การปิดสาขาทำให้รับส่วนแบ่งยอดสะสมหลังหักค่าธรรมเนียมการยุติ การปิดสาขาสุดท้ายทำให้ Charter สิ้นสุด','ควรศึกษาอะไรก่อนถอนตัว?','ค่าธรรมเนียมการยุติ','อันดับชุมชน','คะแนนแบบทดสอบ','exits']]};
export type Member={id:string;name:string;x_username:string;avatar:string;description:string;contribution:string;category:string;link:string;featured:boolean};
