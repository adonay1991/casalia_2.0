"use client";

import {
	Calculator as CalculatorIcon,
	Info as InfoIcon,
	WhatsappLogo as WhatsAppIcon,
} from "@phosphor-icons/react";
import { useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface MortgageCalculatorProps {
	defaultPropertyPrice?: number;
}

export function MortgageCalculator({
	defaultPropertyPrice = 200000,
}: MortgageCalculatorProps) {
	const [propertyPrice, setPropertyPrice] = useState(defaultPropertyPrice);
	const [downPaymentPercent, setDownPaymentPercent] = useState(20);
	const [interestRate, setInterestRate] = useState(3.5);
	const [loanTermYears, setLoanTermYears] = useState(25);

	const calculations = useMemo(() => {
		const downPayment = (propertyPrice * downPaymentPercent) / 100;
		const loanAmount = propertyPrice - downPayment;
		const monthlyRate = interestRate / 100 / 12;
		const numberOfPayments = loanTermYears * 12;

		// Monthly payment formula: M = P[r(1+r)^n]/[(1+r)^n-1]
		let monthlyPayment: number;
		if (monthlyRate === 0) {
			monthlyPayment = loanAmount / numberOfPayments;
		} else {
			const compoundRate = (1 + monthlyRate) ** numberOfPayments;
			monthlyPayment =
				(loanAmount * (monthlyRate * compoundRate)) / (compoundRate - 1);
		}

		const totalPayment = monthlyPayment * numberOfPayments;
		const totalInterest = totalPayment - loanAmount;

		return {
			downPayment,
			loanAmount,
			monthlyPayment,
			totalPayment,
			totalInterest,
		};
	}, [propertyPrice, downPaymentPercent, interestRate, loanTermYears]);

	const formatCurrency = useCallback((value: number): string => {
		return new Intl.NumberFormat("es-ES", {
			style: "currency",
			currency: "EUR",
			maximumFractionDigits: 0,
		}).format(value);
	}, []);

	const handleShareWhatsApp = useCallback(() => {
		const message = `Calculo de hipoteca:
Precio: ${formatCurrency(propertyPrice)}
Entrada: ${formatCurrency(calculations.downPayment)} (${downPaymentPercent}%)
Prestamo: ${formatCurrency(calculations.loanAmount)}
Tipo de interes: ${interestRate}%
Plazo: ${loanTermYears} anos
Cuota mensual: ${formatCurrency(calculations.monthlyPayment)}

Calculado en Casalia Inmobiliaria`;

		const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
		window.open(whatsappUrl, "_blank");
	}, [
		propertyPrice,
		calculations,
		downPaymentPercent,
		interestRate,
		loanTermYears,
		formatCurrency,
	]);

	return (
		<div className="grid lg:grid-cols-2 gap-8">
			{/* Input Form */}
			<Card className="p-6">
				<div className="flex items-center gap-2 mb-6">
					<CalculatorIcon className="h-6 w-6 text-[var(--casalia-orange)]" />
					<h2 className="text-xl font-semibold">Datos del prestamo</h2>
				</div>

				<div className="space-y-6">
					{/* Property Price */}
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<Label htmlFor="propertyPrice">Precio de la vivienda</Label>
							<span className="font-semibold text-lg">
								{formatCurrency(propertyPrice)}
							</span>
						</div>
						<Input
							id="propertyPrice"
							type="number"
							min={50000}
							max={2000000}
							step={10000}
							value={propertyPrice}
							onChange={(e) =>
								setPropertyPrice(Number(e.target.value) || 50000)
							}
						/>
						<Slider
							value={[propertyPrice]}
							onValueChange={([value]) => value && setPropertyPrice(value)}
							min={50000}
							max={2000000}
							step={10000}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>50.000 EUR</span>
							<span>2.000.000 EUR</span>
						</div>
					</div>

					{/* Down Payment */}
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<Label htmlFor="downPayment">Entrada</Label>
							<span className="font-semibold text-lg">
								{downPaymentPercent}% (
								{formatCurrency(calculations.downPayment)})
							</span>
						</div>
						<Slider
							value={[downPaymentPercent]}
							onValueChange={([value]) =>
								value !== undefined && setDownPaymentPercent(value)
							}
							min={10}
							max={50}
							step={5}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>10%</span>
							<span>50%</span>
						</div>
					</div>

					{/* Interest Rate */}
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<Label htmlFor="interestRate">Tipo de interes anual</Label>
							<span className="font-semibold text-lg">{interestRate}%</span>
						</div>
						<Slider
							value={[interestRate]}
							onValueChange={([value]) =>
								value !== undefined && setInterestRate(value)
							}
							min={1}
							max={8}
							step={0.1}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>1%</span>
							<span>8%</span>
						</div>
					</div>

					{/* Loan Term */}
					<div className="space-y-3">
						<div className="flex justify-between items-center">
							<Label htmlFor="loanTerm">Plazo del prestamo</Label>
							<span className="font-semibold text-lg">
								{loanTermYears} anos
							</span>
						</div>
						<Slider
							value={[loanTermYears]}
							onValueChange={([value]) =>
								value !== undefined && setLoanTermYears(value)
							}
							min={5}
							max={40}
							step={1}
							className="w-full"
						/>
						<div className="flex justify-between text-xs text-muted-foreground">
							<span>5 anos</span>
							<span>40 anos</span>
						</div>
					</div>
				</div>
			</Card>

			{/* Results */}
			<div className="space-y-6">
				{/* Monthly Payment Highlight */}
				<Card className="p-6 bg-[var(--casalia-orange)] text-white">
					<p className="text-sm opacity-90 mb-1">Cuota mensual estimada</p>
					<p className="text-4xl font-bold">
						{formatCurrency(calculations.monthlyPayment)}
					</p>
					<p className="text-sm opacity-75 mt-2">
						durante {loanTermYears} anos ({loanTermYears * 12} cuotas)
					</p>
				</Card>

				{/* Breakdown */}
				<Card className="p-6">
					<h3 className="font-semibold mb-4">Desglose del prestamo</h3>
					<div className="space-y-3">
						<div className="flex justify-between py-2 border-b border-border">
							<span className="text-muted-foreground">
								Precio de la vivienda
							</span>
							<span className="font-medium">
								{formatCurrency(propertyPrice)}
							</span>
						</div>
						<div className="flex justify-between py-2 border-b border-border">
							<span className="text-muted-foreground">
								Entrada ({downPaymentPercent}%)
							</span>
							<span className="font-medium text-green-600">
								- {formatCurrency(calculations.downPayment)}
							</span>
						</div>
						<div className="flex justify-between py-2 border-b border-border">
							<span className="text-muted-foreground">
								Importe del prestamo
							</span>
							<span className="font-medium">
								{formatCurrency(calculations.loanAmount)}
							</span>
						</div>
						<div className="flex justify-between py-2 border-b border-border">
							<span className="text-muted-foreground">
								Total intereses ({loanTermYears} anos)
							</span>
							<span className="font-medium text-red-500">
								+ {formatCurrency(calculations.totalInterest)}
							</span>
						</div>
						<div className="flex justify-between py-2 font-semibold">
							<span>Total a pagar</span>
							<span>{formatCurrency(calculations.totalPayment)}</span>
						</div>
					</div>
				</Card>

				{/* Actions */}
				<div className="flex gap-4">
					<Button
						onClick={handleShareWhatsApp}
						variant="outline"
						className="flex-1 gap-2"
					>
						<WhatsAppIcon className="h-5 w-5" />
						Compartir por WhatsApp
					</Button>
				</div>

				{/* Disclaimer */}
				<div className="flex gap-2 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
					<InfoIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
					<p>
						Esta calculadora es solo orientativa. El tipo de interes, la cuota
						final y las condiciones del prestamo pueden variar segun la entidad
						financiera y tu perfil crediticio. Consultanos para obtener
						informacion personalizada.
					</p>
				</div>
			</div>
		</div>
	);
}
