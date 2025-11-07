import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { couponService } from '../services/couponService';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreateCouponModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateCouponModal({ onClose, onSuccess }: CreateCouponModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED' | 'FREEBIE',
    discountValue: '',
    imageUrl: '',
    validFrom: '',
    validUntil: '',
    terms: '',
    categoryId: '',
    maxUsesPerUser: '1',
    totalUsesLimit: '',
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    loadCategories();
    // Definir data de início como hoje
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, validFrom: today }));
  }, []);

  const loadCategories = async () => {
    try {
      const response = await couponService.getCategories();
      setCategories(response.categories);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validar datas
      const validFromDate = new Date(formData.validFrom);
      const validUntilDate = new Date(formData.validUntil);

      if (validUntilDate <= validFromDate) {
        toast.error('Data de validade deve ser posterior à data de início');
        setIsLoading(false);
        return;
      }

      // Preparar dados
      const couponData: any = {
        title: formData.title,
        description: formData.description,
        discountType: formData.discountType,
        validFrom: validFromDate.toISOString(),
        validUntil: validUntilDate.toISOString(),
        maxUsesPerUser: parseInt(formData.maxUsesPerUser) || 1,
      };

      // Adicionar discountValue se não for FREEBIE
      if (formData.discountType !== 'FREEBIE' && formData.discountValue) {
        couponData.discountValue = parseFloat(formData.discountValue);
      }

      // Adicionar campos opcionais
      if (formData.imageUrl) couponData.imageUrl = formData.imageUrl;
      if (formData.terms) couponData.termsConditions = formData.terms;
      if (formData.categoryId) couponData.categoryId = formData.categoryId;
      if (formData.totalUsesLimit) couponData.totalUsesLimit = parseInt(formData.totalUsesLimit);

      await couponService.createCoupon(couponData);
      
      toast.success('Cupom criado com sucesso! Aguardando aprovação do administrador.');
      onSuccess?.();
      onClose();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Erro ao criar cupom';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
                onValueChange={(value: 'PERCENTAGE' | 'FIXED' | 'FREEBIE') => setFormData({ ...formData, discountType: value, discountValue: '' })}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="PERCENTAGE">Porcentagem</SelectItem>
                  <SelectItem value="FIXED">Valor Fixo</SelectItem>
                  <SelectItem value="FREEBIE">Brinde</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">
                {formData.discountType === 'PERCENTAGE' ? 'Porcentagem (%)' : 
                 formData.discountType === 'FIXED' ? 'Valor (R$)' : 'Descrição do Brinde'}
              </Label>
              <Input
                id="discountValue"
                type={formData.discountType === 'FREEBIE' ? 'text' : 'number'}
                placeholder={formData.discountType === 'PERCENTAGE' ? '20' : 
                           formData.discountType === 'FIXED' ? '50.00' : 'Sobremesa grátis'}
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
                required={formData.discountType !== 'FREEBIE'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categoryId">Categoria</Label>
            {isLoadingCategories ? (
              <div className="text-slate-400">Carregando categorias...</div>
            ) : (
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
              >
                <SelectTrigger className="bg-slate-800/50 border-slate-600 text-white">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="validFrom">Válido de</Label>
              <Input
                id="validFrom"
                type="date"
                value={formData.validFrom}
                onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
                required
              />
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
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxUsesPerUser">Máximo de usos por usuário</Label>
              <Input
                id="maxUsesPerUser"
                type="number"
                min="1"
                value={formData.maxUsesPerUser}
                onChange={(e) => setFormData({ ...formData, maxUsesPerUser: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalUsesLimit">Limite total de usos (opcional)</Label>
              <Input
                id="totalUsesLimit"
                type="number"
                min="1"
                value={formData.totalUsesLimit}
                onChange={(e) => setFormData({ ...formData, totalUsesLimit: e.target.value })}
                className="bg-slate-800/50 border-slate-600 text-white"
                placeholder="Sem limite"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem do Cupom</Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://exemplo.com/imagem.jpg"
              value={formData.imageUrl}
              onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
              className="bg-slate-800/50 border-slate-600 text-white placeholder:text-slate-500"
            />
            <p className="text-slate-500 text-sm">Cole a URL da imagem (opcional)</p>
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
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                'Enviar para Aprovação'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
