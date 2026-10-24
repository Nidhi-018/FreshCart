package com.freshcart.service;

import com.freshcart.model.Product;
import com.freshcart.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts(String category, String search) {
        boolean hasCategory = category != null && !category.isBlank() && !category.equalsIgnoreCase("all");
        boolean hasSearch = search != null && !search.isBlank();

        if (hasCategory && hasSearch) {
            return productRepository.findByCategoryIgnoreCaseAndNameContainingIgnoreCase(category.trim(), search.trim());
        } else if (hasCategory) {
            return productRepository.findByCategoryIgnoreCase(category.trim());
        } else if (hasSearch) {
            return productRepository.findByNameContainingIgnoreCase(search.trim());
        } else {
            return productRepository.findAll();
        }
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with id: " + id));
    }

    @Transactional
    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    @Transactional
    public Product updateProduct(Long id, Product updated) {
        Product existing = getProductById(id);
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getEmoji() != null) existing.setEmoji(updated.getEmoji());
        if (updated.getCategory() != null) existing.setCategory(updated.getCategory());
        if (updated.getPrice() != null) existing.setPrice(updated.getPrice());
        if (updated.getUnit() != null) existing.setUnit(updated.getUnit());
        if (updated.getStock() != null) existing.setStock(updated.getStock());
        if (updated.getImg() != null) existing.setImg(updated.getImg());
        return productRepository.save(existing);
    }

    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public void resetCatalog(List<Product> defaults) {
        productRepository.deleteAll();
        productRepository.saveAll(defaults);
    }
}
