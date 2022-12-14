package com.error504.baf.model;

import lombok.Getter;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Past;
import javax.validation.constraints.Size;
import java.util.Date;

@Getter
@Setter
public class ReviewForm {
    @NotEmpty(message="장르는 필수항목입니다.")
    private String genre;

    @NotEmpty(message="리뷰명은 필수항목입니다.")
    @Size(max=200)
    private String subject;

    @Past
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date date;

    @NotEmpty(message="장소명은 필수항목입니다.")
    private String place;

    private String placeAddress;


    @NotNull(message="평점은 필수항목입니다.")
    private Integer grade;

    private String[] amenities;

    @NotEmpty(message="장소 리뷰 내용은 필수항목입니다.")
    private String placeReview;

    private String additionalReview;

    private Boolean isAnonymous;
}