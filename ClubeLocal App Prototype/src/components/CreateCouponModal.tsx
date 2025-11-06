import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CreateCouponModalProps {
  onClose: () => void;
}

export function CreateCouponModal({ onClose }: CreateCouponModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'percentage',
    discountValue: '',
    validUntil: '',
    terms: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui seria enviado para aprovação
    alert('Cupom enviado para aprovação!');
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 border-slate-700 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Criar Novo Cupom</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Cupom</Label>
            <Input
              id="title"
              placeholder="Ex: 20% de desconto no rodízio"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descreva os detalhes da oferta..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 min-h-24"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discountType">Tipo de Desconto</Label>
              <Select
                value={formData.discountType}
                onValueChange={(value) => setFormData({ ...formData, discountType: value })}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="percentage">Porcentagem</SelectItem>
                  <SelectItem value="fixed">Valor Fixo</SelectItem>
                  <SelectItem value="freebie">Brinde</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">
                {formData.discountType === 'percentage' ? 'Porcentagem (%)' : 
                 formData.discountType === 'fixed' ? 'Valor (R$)' : 'Descrição do Brinde'}
              </Label>
              <Input
                id="discountValue"
                placeholder={formData.discountType === 'percentage' ? '20' : 
                           formData.discountType === 'fixed' ? '50.00' : 'Sobremesa grátis'}
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="validUntil">Válido até</Label>
            <Input
              id="validUntil"
              type="date"
              value={formData.validUntil}
              onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
              className="bg-slate-800/50 border-slate-600 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Imagem do Cupom</Label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center hover:border-slate-500 transition-colors cursor-pointer">
              <p className="text-slate-400">Clique para fazer upload da imagem</p>
              <p className="text-slate-500 mt-1">PNG, JPG até 5MB</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="terms">Termos e Condições</Label>
            <Textarea
              id="terms"
              placeholder="Ex: Não cumulativo com outras promoções. Válido apenas para consumo no local..."
              value={formData.terms}
              onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500 min-h-24"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-200 hover:bg-slate-800"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
            >
              Enviar para Aprovação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
